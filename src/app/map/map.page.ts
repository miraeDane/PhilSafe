import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as mapboxgl from 'mapbox-gl';
import { LocationService } from '../services/location.service';
import { Cluster, Coordinates } from '../models/location';
import { ModalController } from '@ionic/angular';
import { map } from 'rxjs';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit {
  selectedRegion: any;
  selectedProvince: any;
  selectedCity: any;
  selectedMunicipality: any = { municipality_id: 875, name: 'City of Cebu' };
  selectedBarangay: any;
  selectedMonth: string = 'all';
  selectedTime: string = 'all';
  selectedStationCode: string = 'all';
  selectedStationName: string = 'all';
  selectedGeneralTime: string = 'all';
  selectedDayName: string = 'all';

  topHours: string[] = [];
  topCounts: number[] = [];
  selectedLevel: any = '1';
  private map!: mapboxgl.Map;
  isModalOpen = false;
  highestCrimeLocation = '';
  highestCrimeTime = '';
  crimeTimeChart: Chart | undefined;
  private mapboxGeocodingUrl =
    'https://api.mapbox.com/geocoding/v5/mapbox.places/reverse.json';
  private mapboxAccessToken = environment.mapboxKey;

  constructor(
    private http: HttpClient,
    private locationService: LocationService,
    private coordinateService: LocationService,
    private modalCtrl: ModalController
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    (mapboxgl as any).accessToken = environment.mapboxKey;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeMap();
    }, 1000);
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mimsh23/clzxshvrk004g01rb21e17pa5',
      center: [123.880283, 10.324278],
      zoom: 12,
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      // Fetch data and add the GeoJSON source here
      this.coordinateService.getCoordinates().subscribe(
        (responses: Cluster[]) => {
          const geoJSONData = this.convertToGeoJSON(responses);
          this.addGeoJSONSource(geoJSONData);
          this.calculateCrimeAnalysis(geoJSONData);
          this.calculateHighestCrimeTime(geoJSONData);
        },
        (error) => {
          console.error('Error fetching coordinates:', error);
        }
      );
    });
  }

  convertToGeoJSON(data: Cluster[]): GeoJSON.FeatureCollection {
    const features: GeoJSON.Feature[] = [];

    data.forEach((item) => {
      if (
        item.centroid &&
        item.centroid.latitude !== undefined &&
        item.centroid.longitude !== undefined
      ) {
        features.push({
          type: 'Feature',
          properties: {
            cluster_label: item.cluster_label,
            density: item.density,
            event_time: item.centroid.event_time,
          },
          geometry: {
            type: 'Point',
            coordinates: [item.centroid.longitude, item.centroid.latitude],
          },
        });
      }

      if (item.coordinates && Array.isArray(item.coordinates)) {
        item.coordinates.forEach((coord) => {
          if (coord.longitude !== undefined && coord.latitude !== undefined) {
            features.push({
              type: 'Feature',
              properties: {
                cluster_label: item.cluster_label,
                density: item.density,
                event_time: coord.eventTime,
              },
              geometry: {
                type: 'Point',
                coordinates: [coord.longitude, coord.latitude],
              },
            });
          } else {
            console.warn(
              'Missing longitude or latitude in coordinates:',
              coord
            );
          }
        });
      } else {
        console.warn('Invalid coordinates for item:', item);
      }
    });

    const validFeatures = features.filter(
      (feature): feature is GeoJSON.Feature => feature !== undefined
    );

    const geoJSONResult: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: validFeatures,
    };

    console.log('Converted GeoJSON:', JSON.stringify(geoJSONResult, null, 2));

    return geoJSONResult;
  }

  addGeoJSONSource(geoJSONData: GeoJSON.FeatureCollection) {
    if (this.map.getSource('my-data')) {
      this.map.removeLayer('crimes');
      this.map.removeSource('my-data');
    }

    this.map.addSource('my-data', {
      type: 'geojson',
      data: geoJSONData,
    });

    this.map.addLayer({
      id: 'crimes',
      type: 'heatmap',
      source: 'my-data',
      minzoom: 11,
      slot: 'middle',
      paint: {
        'heatmap-radius': 5,
        'heatmap-opacity': 0.63,
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(0, 0, 255, 0)',
          0.1,
          'hsl(189, 88%, 49%)',
          0.4,
          'hsl(69, 100%, 50%)',
          0.7,
          'hsl(37, 100%, 50%)',
          1,
          'red',
        ],
      },
    });
  }

  // async initializeAndOpenModal(geoJSONData: GeoJSON.FeatureCollection) {
  //   await this.calculateHighestCrimeTime(geoJSONData);
  //   this.openCrimeAnalysisModal();
  // }

  async calculateHighestCrimeTime(geoJSONData: GeoJSON.FeatureCollection) {
    const hourCountMap: { [hour: string]: number } = {};

    // Extract the features and count occurrences of each hour
    geoJSONData.features.forEach((feature) => {
      if (
        feature.properties &&
        feature.properties['event_time'] &&
        typeof feature.properties['event_time'] === 'string'
      ) {
        const timeParts = feature.properties['event_time'].split(':');
        if (timeParts.length === 3) {
          const [hour] = timeParts.map((part) => parseInt(part, 10));
          const hourString = String(hour).padStart(2, '0');

          if (!hourCountMap[hourString]) {
            hourCountMap[hourString] = 0;
          }
          hourCountMap[hourString]++;
        }
      }
    });

    // Convert to an array of [hour, count] and sort by count
    const sortedHours = Object.entries(hourCountMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4); // Take top 4

    // Format hours as ${hour}:00
    const topHours = sortedHours.map(([hour]) => `${hour}:00`);
    const topCounts = sortedHours.map(([, count]) => count);

    // Find the highest crime time
    const [mostFrequentHour] = Object.entries(hourCountMap).reduce(
      (max, [hour, count]) => (count > max[1] ? [hour, count] : max),
      ['', 0]
    );

    // Format most frequent hour for display
    this.highestCrimeTime = mostFrequentHour
      ? `${mostFrequentHour}:00`
      : 'No data';

    // Log the results
    console.log('Most frequent hour:', this.highestCrimeTime);
    console.log('Top 4 hours:', topHours);
    console.log('Top 4 counts:', topCounts);

    // Update the chart with top 4 data
    this.createCrimeTimeChart(topHours, topCounts);
  }

  updateCrimeTimeChart(topHours: string[], topCounts: number[]) {
    if (this.crimeTimeChart) {
      this.crimeTimeChart.data.labels = topHours;
      this.crimeTimeChart.data.datasets[0].data = topCounts;
      this.crimeTimeChart.update();
    } else {
      console.error('Chart instance not found');
    }
  }

  createCrimeTimeChart(topHours: string[], topCounts: number[]) {
    const canvas = document.getElementById('crimeTimeChart') as HTMLCanvasElement | null;
    
    if (canvas) {
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        if (this.crimeTimeChart) {
          // Update existing chart
          this.crimeTimeChart.data.labels = topHours;
          this.crimeTimeChart.data.datasets[0].data = topCounts;
          this.crimeTimeChart.update();
        } else {
          // Create new chart
          this.crimeTimeChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: topHours,
              datasets: [
                {
                  label: 'Top 4 Crime Frequencies per Hour',
                  data: topCounts,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  fill: true,
                  tension: 0.1,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Hour of the Day',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Number of Crimes',
                  },
                },
              },
              responsive: true,
              maintainAspectRatio: false,
            },
          });
        }
      } else {
        console.error('Failed to get 2D context from canvas');
      }
    } else {
      console.error('Canvas element not found');
    }
  }
  

  calculateCrimeAnalysis(geoJSONData: GeoJSON.FeatureCollection) {
    let highestDensityFeature: any = null;
    let highestDensity = -Infinity;

    geoJSONData.features.forEach((feature) => {
      if (feature.properties && feature.properties['density'] !== undefined) {
        const density = feature.properties['density'];

        if (density > highestDensity) {
          highestDensity = density;
          highestDensityFeature = feature;
        }
      }
    });

    if (highestDensityFeature) {
      const [longitude, latitude] = highestDensityFeature.geometry.coordinates;
      this.getLocationName(latitude, longitude);
    } else {
      console.error('No features with density found');
    }
  }

  getLocationName(latitude: number, longitude: number) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${environment.mapboxKey}`;

    this.http.get<any>(url).subscribe(
      (response) => {
        this.highestCrimeLocation =
          response?.features?.[0]?.place_name || 'Unknown location';
        console.log(
          'Highest density location name:',
          this.highestCrimeLocation
        );
      },
      (error) => {
        console.error('Error fetching location name:', error);
      }
    );
  }

  async openCrimeAnalysisModal() {
    this.isModalOpen = true;
    console.log(this.highestCrimeLocation);
    console.log(this.highestCrimeTime);

    // Ensure that calculateHighestCrimeTime has been called
    if (!this.topHours.length || !this.topCounts.length) {
      // Provide a fallback or a loading state if needed
      console.error('Top hours and counts are not available.');
    }

    // Wait for the modal to be presented and chart to be created
    setTimeout(() => {
      this.createCrimeTimeChart(this.topHours, this.topCounts);
    }, 500); // Adjust timing as needed
  }

  closeCrimeAnalysisModal() {
    this.isModalOpen = false;
  }

  density_level = [
    { level: '1', status: 100, type: 'Elevated Risk', progress: 1 },
    { level: '2', status: 70, type: 'Moderate Concern', progress: 0.7 },
    { level: '3', status: 40, type: 'Remain Aware', progress: 0.4 },
    { level: '3', status: 10, type: 'Low Risk', progress: 0.1 },
  ];

  getStatusClass(value: number): string {
    if (value === 100) {
      return 'risky';
    } else if (value >= 70) {
      return 'risk';
    } else if (value >= 40) {
      return 'alert';
    } else if (value >= 10) {
      return 'safe';
    }
    return '';
  }

  calculateOverallProgress(): number {
    if (this.density_level.length === 0) return 0;

    let totalProgress = 0;
    let totalWeight = 0;

    this.density_level.forEach((density) => {
      totalProgress += density.progress;
      totalWeight += 1;
    });

    return totalWeight > 0 ? totalProgress / totalWeight : 0;
  }

  levelChanged(value: any) {
    this.selectedLevel = value;
    console.log(this.selectedLevel);
  }
}
