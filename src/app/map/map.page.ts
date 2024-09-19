import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as mapboxgl from 'mapbox-gl';
import { LocationService } from '../services/location.service';
import { Cluster, Coordinates } from '../models/location';
import { ModalController } from '@ionic/angular';
import { map } from 'rxjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  registerables,
  Title,
  Tooltip,
} from 'chart.js';


@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit {
  
  topHours: string[] = [];
  topCounts: number[] = [];
  topLocations: string[] = [];
  topLocationCounts: number[] = [];
  selectedLevel: any = '1';
  private map!: mapboxgl.Map;
  isModalOpen = false;
  highestCrimeLocation: any = '';
  highestCrimeTime = '';
  crimeTimeChart: Chart | undefined;
  private locationCache: { [key: string]: string } = {};

  constructor(
    private http: HttpClient,
    private locationService: LocationService,
    private coordinateService: LocationService,
    private modalCtrl: ModalController
  ) {
    Chart.register(
      
      CategoryScale,
      LinearScale,
      BarController,
      BarElement,
      LineController,
      LineElement,
      PointElement,
      Title,
      Tooltip,
      PieController,
      ArcElement,
     ChartDataLabels
      
    );
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

  async openCrimeAnalysisModal() {
    this.isModalOpen = true;


    setTimeout(() => {
      if (this.topHours.length && this.topCounts.length) {
        this.createCrimeTimeChart(this.topHours, this.topCounts);
      } else {
        // console.error('Top hours and counts are not available.');
        // console.log(
        //   'Heres the tophours and topcounts',
        //   this.topHours,
        //   this.topCounts
        // );
      }
      if (this.topLocations.length && this.topLocationCounts.length) {
        this.createCrimeLocationPieChart(this.topLocations, this.topLocationCounts);
      } else {
        console.error('Top locations and counts are not available.');
        // console.log(
        //   'Heres the top location and topcounts',
        //   this.topLocations,
        //   this.topLocationCounts
        // );
      }
      
    }, 500);
  }

  convertToGeoJSON(data: Cluster[]): GeoJSON.FeatureCollection {
    const features: GeoJSON.Feature[] = [];

    data.forEach((item) => {
   
      if (item.centroid) {
        const { longitude, latitude } = item.centroid;
        if (latitude !== undefined && longitude !== undefined) {
          features.push({
            type: 'Feature',
            properties: {
              cluster_label: item.cluster_label,
              density: item.density,
              centroid: item.centroid,
            },
            geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
          });
        }
      }

   
      if (item.coordinates && Array.isArray(item.coordinates)) {
        item.coordinates.forEach((coord) => {
          const { longitude, latitude, event_time } = coord;
          if (longitude !== undefined && latitude !== undefined) {
            features.push({
              type: 'Feature',
              properties: {
                cluster_label: item.cluster_label,
                density: item.density,
                event_time,
              },
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
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

  //  console.log('Converted GeoJSON:', JSON.stringify(geoJSONResult, null, 2));

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

  async calculateHighestCrimeTime(geoJSONData: GeoJSON.FeatureCollection) {
 
    const eventTimes: string[] = [];

    geoJSONData.features.forEach((feature) => {
      if (feature.properties?.['event_time']) {
        eventTimes.push(feature.properties['event_time']);
      }
    });

    // console.log('Event Times:', eventTimes);

    // Count occurrences of each hour in the event times
    const hourCountMap: { [hour: string]: number } = {};

    eventTimes.forEach((eventTime) => {
      const timeParts = eventTime.split(':');
      if (timeParts.length >= 2) {
        const hour = timeParts[0].padStart(2, '0');
        hourCountMap[hour] = (hourCountMap[hour] || 0) + 1;
      }
    });

    //  Sort and get the top 5 hours
    const sortedHours = Object.entries(hourCountMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const topHours = sortedHours.map(([hour]) => `${hour}:00`);
    const topCounts = sortedHours.map(([, count]) => count);

    // the most frequent hour
    const [mostFrequentHour] =
      sortedHours.length > 0 ? sortedHours[0] : ['', 0];
    this.highestCrimeTime = mostFrequentHour
      ? `${mostFrequentHour}:00`
      : 'No data';

    // Log the results
    // console.log('Most frequent hour:', this.highestCrimeTime);
    // console.log('Top 5 hours:', topHours);
    // console.log('Top 5 counts:', topCounts);

    this.topHours = topHours;
    this.topCounts = topCounts;

    // Ensure data is available
    this.openCrimeAnalysisModal();
  }

 

  createCrimeTimeChart(topHours: string[], topCounts: number[]) {
    if (
      !Array.isArray(topHours) ||
      !Array.isArray(topCounts) ||
      !topHours.length ||
      !topCounts.length
    ) {
      // console.log('Heres the tophours and topcounts', topHours, topCounts);
      console.error(
        'Invalid data for chart rendering. Please ensure both topHours and topCounts are provided and are arrays with at least one element.'
      );
      return;
    }

    const sortedData = topHours
      .map((hour, index) => ({ hour, count: topCounts[index] }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    const sortedHours = sortedData.map((data) => data.hour);
    const sortedCounts = sortedData.map((data) => data.count);

    try {
      console.log('Creating chart...');
      const canvas = document.getElementById(
        'crimeTimeChart'
      ) as HTMLCanvasElement | null;

      if (canvas) {
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Clear previous chart if it exists
          if (this.crimeTimeChart) {
            this.crimeTimeChart.destroy();
            this.crimeTimeChart = undefined;
          }

          // Create new chart
          this.crimeTimeChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: sortedHours.length ? sortedHours : ['Loading...'],
              datasets: [
                {
                  label: 'Top 5 Crime Frequencies per Hour',
                  data: sortedCounts.length ? sortedCounts : [0],
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
                  ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
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
              plugins: {
                title: {
                  display: true,
                  text: 'Top 5 Crime Frequencies per Time',
                },
              },
            },
          });
        } else {
          console.error('Failed to get 2D context from canvas');
        }
      } else {
        // console.error('Canvas element not found');
      }
    } catch (error) {
      console.error('Error creating crime time chart:', error);
    }
  }

async calculateCrimeAnalysis(geoJSONData: GeoJSON.FeatureCollection) {
    let highestDensityFeature: GeoJSON.Feature | undefined;
    let highestDensity = -Infinity;
    const featuresWithDensity: Array<{ feature: GeoJSON.Feature; density: number }> = [];

    // Collect all features with their densities
    geoJSONData.features.forEach((feature) => {
        const density = feature.properties?.['density'] || 0;
        featuresWithDensity.push({ feature, density });

        // Track highest density feature
        if (density > highestDensity) {
            highestDensity = density;
            highestDensityFeature = feature;
        }
    });

    // Sort features by density in descending order
    const sortedFeatures = featuresWithDensity.sort((a, b) => b.density - a.density);

    // Get top 5 unique densities
    const topFeatures: Array<{ feature: GeoJSON.Feature; density: number }> = [];
    const uniqueDensities = new Set<number>();

    for (const { feature, density } of sortedFeatures) {
        if (!uniqueDensities.has(density)) {
            uniqueDensities.add(density);
            topFeatures.push({ feature, density });
        }
        if (topFeatures.length === 5) {
            break; // Stop once we have 5 unique densities
        }
    }

    // Extract centroid coordinates from top features
    const centroidCoordinates = topFeatures.map(({ feature }) => {
        const centroid = feature.properties?.['centroid']; 
        return centroid ? [centroid.longitude, centroid.latitude] : null;
    }).filter(Boolean) as [number, number][]; // Filter out null values

    //Convert centroid coordinates to location names
    const locationPromises = centroidCoordinates.map(async (coords) => {
        return this.getLocationName(coords[1], coords[0]); // Note: latitude, longitude
    });

    const highestLocationNamePromise = highestDensityFeature
        ? this.getLocationName(
            (highestDensityFeature.geometry as GeoJSON.Point).coordinates[1],
            (highestDensityFeature.geometry as GeoJSON.Point).coordinates[0]
        )
        : Promise.resolve('Unknown location');

    // Wait for all location names to be fetched
    const locationNames = await Promise.all(locationPromises);
    this.highestCrimeLocation = await highestLocationNamePromise;
    this.topLocations = locationNames;
    this.topLocationCounts = topFeatures.map(({ density }) => density); // Get densities of top features

    // console.log('Highest crime location:', this.highestCrimeLocation);
    // console.log('Top 5 crime locations from logic', this.topLocations);
    // console.log('Top 5 crime location Counts from logic', this.topLocationCounts);

    this.createCrimeLocationPieChart(locationNames, this.topLocationCounts);
    this.openCrimeAnalysisModal();
}

getLocationName(latitude: number, longitude: number): Promise<string> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${environment.mapboxKey}&types=locality,neighborhood&limit=1`;

    return new Promise((resolve, reject) => {
        this.http.get<any>(url).subscribe(
            (response) => {
                const features = response?.features || [];
                let barangayName = 'Unknown location';

                if (features.length > 0) {
                    // Assuming the first feature is the barangay or closest locality
                    barangayName = features[0].text || 'Unknown location';
                }

                resolve(barangayName);
            },
            (error) => {
                console.error('Error fetching location name:', error);
                reject('Unknown location');
            }
        );
    });
}



createCrimeLocationPieChart(locations: string[], counts: number[]) {


    if (!Array.isArray(locations) || !Array.isArray(counts) || locations.length === 0 || counts.length === 0) {
        // console.error('Invalid data for pie chart rendering. Please ensure both locations and counts are provided and are arrays with at least one element.');
        // console.log('Top 5 locations pie chart recipient:', locations);
        // console.log('Top Counts pie chart recipient:', counts);
        return; 
    }
    // console.log('Top 5 locations pie chart recipient:', locations);
    // console.log('Top Counts pie chart recipient:', counts);

    const canvas = document.getElementById('crimeLocationPieChart') as HTMLCanvasElement | null;
    if (!canvas) {
        // console.error('Canvas element for pie chart not found');
        return;
    }



    const ctx = canvas.getContext('2d');
    if (!ctx) {
        // console.error('Failed to get 2D context from canvas');
        return;
    }

    const backgroundColors = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
  ];
    
    // Create new pie chart
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: locations,
            datasets: [{
                label: 'Top 5 Crime Frequencies per Location',
                data: counts, // Keep counts for the pie chart data
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title:{
                  display: true,
                  text: 'Top 5 Crime Frequencies per Location',
              },
                legend: {
                  display: true,
                    position: 'top',
                    labels: {
                      font: {
                        size: 16
                      },
                      boxWidth: 20,
                      padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            const dataset = tooltipItem.dataset;
                            const currentValue = dataset.data[tooltipItem.dataIndex] as number;
                            const total = dataset.data.reduce((acc, value) => {
                                return (typeof acc === 'number' ? acc : 0) + (typeof value === 'number' ? value : 0);
                            }, 0);
                            const percentage = total > 0 ? ((currentValue / total) * 100).toFixed(2) : '0.00';
                            return `${tooltipItem.label} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
               
                    formatter: (value, context) => {
                     let total: any = 0;
                    // Ensure we only reduce over numeric values
                    total = context.dataset.data.reduce((acc, val) => {
                        const numericAcc = typeof acc === 'number' ? acc : 0;
                        const numericVal = typeof val === 'number' ? val : 0;
                        return numericAcc + numericVal;
                    }, 0);

                    const validValue = typeof value === 'number' ? value : 0; 
                    const validTotal = total > 0 ? total : 1; 

                    const percentage = ((validValue / validTotal) * 100).toFixed(2);

                   
                    const label = context.chart.data.labels && context.chart.data.labels[context.dataIndex] 
                        ? context.chart.data.labels[context.dataIndex] 
                        : 'Unknown';

                    return `${label} (${percentage}%)`; 
                    },
                    color: '#000',
                    align: 'start', 
                    anchor: 'end',
                  
                },
            },
        },
    });
   
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
