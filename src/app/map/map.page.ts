import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as mapboxgl from 'mapbox-gl';
import { LocationService } from '../services/location.service';
import { Cluster, Coordinates, Location } from '../models/location';
import { concatMap, delay, catchError } from 'rxjs/operators';
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
import { CrimeService } from '../services/crime.service';
import { IncidentType } from '../models/incident-type';


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
  barangays: string[] = [];
  categories: string[] = [];
  incidentTypes: IncidentType[] = [];
  selectedBarangays: string[] = [];
  selectedCrimes: IncidentType[] = [];
  crimesAlertOptions: any = {
    header: 'Select Crimes',
    subHeader: 'Choose one or more',
    message: 'Select your options',
    translucent: true,
    cssClass: 'custom-alert',
    buttons: [
      {
        text: 'Clear'
      },
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'OK'
      }
    ]
  };
  barangayAlertOptions: any = {
  header: 'Select Barangays',
  subHeader: 'Choose one or more',
  message: 'Select your options',
  translucent: true,
  cssClass: 'custom-alert',
  buttons: [
    {
      text: 'Clear'
    },
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'OK'
    }
  ]
};
incidentTypeMap: { [key: number]: string } = {};
incidentTypeCountMap: any = {}
selectedIncidentID: number = 0;
isFilterModalOpen = false; // Control modal visibility
totalCrimes: number = 0;
total_incidents: number = 0
incidentName: string = '';
topCrimeLocations: { location: string; count: number }[] = [];
crimeLocationPieChart!: Chart<'pie', number[], string>;
crimeProfileStatement: string = '';



  private locationCache: { [key: string]: string } = {};
  incidentCountPerBarangay: { [key: string]: number; } = {};

  constructor(
    private http: HttpClient,
    private locationService: LocationService,
    private coordinateService: LocationService,
    private modalCtrl: ModalController,
    private crimeService: CrimeService
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
    this.loadBarangays();
    this.loadIncidentTypes();
    this.loadTotalCrimeDensity();
    
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const applyFilter = this.selectedIncidentID ? true : false; 
        this.initializeMap(applyFilter);
    }, 1000);

    
  }




initializeMap(applyFilter: boolean) {
  this.map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mimsh23/clzxshvrk004g01rb21e17pa5',
    center: [123.880283, 10.324278],
    zoom: 12,
  });

  this.map.addControl(new mapboxgl.NavigationControl());

  this.map.on('load', () => {
    const locationService = applyFilter
      ? this.locationService.getFullCoordinates(this.selectedIncidentID)
      : this.locationService.getCoordinates();

    locationService.subscribe(
      async (responses: Cluster[]) => {
       

        let filteredResponses: Cluster[] = responses;

        // Only filter by barangay if "All Barangays" is NOT selected
        
        if (
          applyFilter &&
          this.selectedBarangays &&
          this.selectedBarangays.length > 0 &&
          !this.selectedBarangays.includes('All Barangays')
        ) {
          const promises = responses.map(async (cluster) => {
            if (cluster.coordinates) {
              const filteredCoordinates = cluster.coordinates.filter(coord => {
                // Use the barangay directly from the cluster
                const barangayName = coord.barangay; // Assuming barangay is a property of cluster
                return this.selectedBarangays.includes(barangayName);
              });

              return {
                ...cluster,
                coordinates: filteredCoordinates,
              };
            }
            return cluster;
          });

          filteredResponses = await Promise.all(promises);
          filteredResponses = filteredResponses.filter(cluster => cluster.coordinates && cluster.coordinates.length > 0) as Cluster[];
        }

        const geoJSONData = this.convertToGeoJSON(filteredResponses, applyFilter);
        this.addGeoJSONSource(geoJSONData); 
        this.calculateCrimeAnalysis(geoJSONData);
        this.calculateHighestCrimeTime(geoJSONData);

        // Set up map click interaction for displaying popups
        this.map.on('click', 'crimes', async (e) => {
          if (e.features && e.features.length > 0) {
            const geometry = e.features[0].geometry;
            const properties = e.features[0].properties;

            console.log('Properties:', properties);
            console.log('Geometry:', geometry);
            


            if (geometry.type === 'Point') {
              const coordinates: [number, number] = geometry.coordinates as [number, number];
              const properties = e.features[0].properties;

              if (properties) {
              
                const eventTime = properties['event_time'] || 'Event Time Not Available';
                const incidentName = properties['incident'] || 'Incident Not Available';
                const barangayName = properties['barangay'] || 'Barangay Not Available';
                

                // Adjust based on the filtering context
                const incidentType = applyFilter
                  ? this.incidentTypeMap[this.selectedIncidentID] || 'Incident Type Not Available'
                  : incidentName; // Use incident from properties if not filtered

                new mapboxgl.Popup()
                  .setLngLat(coordinates)
                  .setHTML(
                    `<h3 style="color: #000000">${incidentName}</h3>
                    <p style="color: #000000"><strong>Barangay:</strong> ${barangayName}</p>
                    <p style="color: #000000"><strong>Time Committed:</strong> ${eventTime}</p>`
                  )
                  .addTo(this.map);
              } else {
                console.warn('Properties are undefined or null.');
              }
            } else {
              console.warn('The geometry type is not a Point:', geometry.type);
            }
          } else {
            console.warn('No features found at the clicked location.');
          }
        });

        console.log('Filtered coordinates data:', filteredResponses);
      },
      (error) => {
        console.error('Error fetching coordinates:', error);
      }
    );
  });
}









  async openCrimeAnalysisModal() {
    this.isModalOpen = true;
    this.generateCrimeProfile();

    setTimeout(() => {
      if (this.topHours.length && this.topCounts.length) {
        this.createCrimeTimeChart(this.topHours, this.topCounts);
      } else {
        console.error('Top hours and counts are not available.');
        console.log(
          'Heres the tophours and topcounts',
          this.topHours, 
          this.topCounts
        );
      }
      if (this.topCrimeLocations && this.topCrimeLocations.length) {
        // Extract location names and counts
        const topLocationNames = this.topCrimeLocations.map(loc => loc.location);
        const topLocationCounts = this.topCrimeLocations.map(loc => loc.count);
  
        console.log("TopcrimeLocation:", topLocationNames);
        console.log("TopcrimeLocation:", topLocationCounts);
        this.createCrimeLocationPieChart(topLocationNames, topLocationCounts);
      }
      
    }, 500);
  }

  convertToGeoJSON(data: Cluster[], isFilterApplied: boolean): GeoJSON.FeatureCollection {
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
              barangay: item.barangay,
              // Set point size and opacity based on filter state
              pointSize: isFilterApplied ? 10 : 5,  // Example size, adjust as necessary
              opacity: isFilterApplied ? 0.8 : 0.5,  // Example opacity, adjust as necessary
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
          const { longitude, latitude, event_time, incident, barangay } = coord;
          if (longitude !== undefined && latitude !== undefined) {
            features.push({
              type: 'Feature',
              properties: {
                cluster_label: item.cluster_label,
                density: item.density,
                barangay,
                event_time,
                incident: incident || 'Incident Not Available',
                // Set point size and opacity based on filter state
                pointSize: isFilterApplied ? 10 : 5,
                opacity: isFilterApplied ? 0.8 : 0.5
                
              },
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
            });
          } else {
            console.warn('Missing longitude or latitude in coordinates:', coord);
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
        'heatmap-radius': 8,
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
    console.log('Most frequent hour:', this.highestCrimeTime);
    console.log('Top 5 hours:', topHours);
    console.log('Top 5 counts:', topCounts);

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
  // Step 1: Check if there are features in GeoJSON data
  if (!geoJSONData.features || geoJSONData.features.length === 0) {
      console.warn('No features available in GeoJSON data.');
      return; // Exit early if there are no features
  }

  // Step 2: Count incidents per location based on barangay property
  const crimeCounts: Record<string, number> = {};
  geoJSONData.features.forEach((feature) => {
      const barangay = feature.properties?.['barangay']; // Safe access to properties
   

      if (barangay) {
          crimeCounts[barangay] = (crimeCounts[barangay] || 0) + 1;
      }
  });

  // Step 3: Convert counts to an array and sort
  const sortedCrimeCounts = Object.entries(crimeCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count);

  // Step 4: Proceed only if sorted crime counts are available
  if (sortedCrimeCounts.length === 0) {
      console.warn('No crimes to analyze after counting.');
      return; // Exit early if no crime counts are found
  }

  // Get top 5 locations
  const topLocations = sortedCrimeCounts.slice(0, 5);
  const topLocationNames = topLocations.map(({ location }) => location);
  const topLocationCounts = topLocations.map(({ count }) => count);

  // Log the top locations for debugging
  console.log('Top locations:', topLocations);

  this.topCrimeLocations = topLocations;

  // Get the highest crime location
  this.highestCrimeLocation = topLocationNames[0] || 'Unknown location';

  console.log('Top Location Names:', topLocationNames);
  console.log('Top Location Counts:', topLocationCounts);
  // Prepare pie chart data
  this.createCrimeLocationPieChart(topLocationNames, topLocationCounts);
  this.openCrimeAnalysisModal();
}

async generateCrimeProfile() {

  if (!this.topCrimeLocations || !this.topHours || !this.topCounts || this.topCrimeLocations.length === 0 || this.topHours.length === 0) {
      console.warn('Insufficient data for generating crime profile.');
      return;
  }

  // Top crime location and highest crime count
  const highestCrimeLocation = this.topCrimeLocations[0].location;
  const highestCrimeLocationCount = this.topCrimeLocations[0].count;

  // Most frequent crime hour and its count
  const mostFrequentCrimeHour = this.topHours[0];
  const mostFrequentCrimeCount = this.topCounts[0];

  // Create the profiling statement
  this.crimeProfileStatement = `${highestCrimeLocation} has the highest crime rate. Crimes' peak time occurring at ${mostFrequentCrimeHour}. This hour sees ${mostFrequentCrimeCount} incidents of crime.`;

  // Log or display the result in the UI
  console.log(this.crimeProfileStatement);
}




createCrimeLocationPieChart(locations: string[], counts: number[]) {
  if (!Array.isArray(locations) || !Array.isArray(counts) || locations.length === 0 || counts.length === 0) {
    console.error('Invalid data for pie chart rendering');
    return;
  }

  const canvas = document.getElementById('crimeLocationPieChart') as HTMLCanvasElement | null;
  if (!canvas) {
    console.error('Canvas element for pie chart not found');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get 2D context from canvas');
    return;
  }

  // Destroy existing chart if it exists
  if (this.crimeLocationPieChart) {
    this.crimeLocationPieChart.destroy();
  }

  // Create new pie chart
  this.crimeLocationPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: locations,
      datasets: [{
        label: 'Top 5 Crime Frequencies per Location',
        data: counts,
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
        title: {
          display: true,
          text: 'Top 5 Crime Frequencies per Location',
        },
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 16,
            },
            boxWidth: 20,
            padding: 15,
          },
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const dataset = tooltipItem.dataset;
              const currentValue = dataset.data[tooltipItem.dataIndex] as number;
              const total = dataset.data.reduce((acc, value) => {
                const numericAcc = typeof acc === 'number' ? acc : 0;
                const numericVal = typeof value === 'number' ? value : 0;
                return numericAcc + numericVal;
              }, 0);
              const percentage = total > 0 ? ((currentValue / total) * 100).toFixed(2) : '0.00';
              return `${tooltipItem.label} (${percentage}%)`;
            },
          },
        },
        datalabels: {
          formatter: (value, context) => {
            // Ensure `total` is treated as a number and initialize it safely
            const total = (context.dataset.data as number[]).reduce((acc, val) => {
              const numericAcc = typeof acc === 'number' ? acc : 0;
              const numericVal = typeof val === 'number' ? val : 0;
              return numericAcc + numericVal;
            }, 0);
          
            // Safely coerce `total` to a number and provide a fallback to 1
            const validTotal = total && typeof total === 'number' && total > 0 ? total : 1;
          
            // Ensure `value` is a number and calculate the percentage
            const validValue = typeof value === 'number' ? value : 0;
            const percentage = ((validValue / validTotal) * 100).toFixed(2);
          
            // Safely retrieve the label
            const label = context.chart.data.labels && context.chart.data.labels[context.dataIndex]
              ? context.chart.data.labels[context.dataIndex]
              : 'Unknown';
          
            return `${label} (${percentage}%)`;
          }
          ,
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


  loadBarangays() {
    this.locationService.getAllLocation().subscribe((locations: any[]) => {
      if (locations) {
        this.barangays = [...new Set(locations.map(location => location.barangay))];
        this.barangays.sort((a, b) => a.localeCompare(b));
      }
    }, error => {
      console.error('Error loading locations', error);
    });

    
  }

  onBarangaySelection() {
    if (this.selectedBarangays.includes('All Barangays')) {
      this.selectedBarangays = this.barangays.slice();
    } else if (this.selectedBarangays.length === 0) {
      this.selectedBarangays = [];
    }
  }
 
  loadIncidentTypes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.crimeService.loadIncidentTypes().subscribe((incidentData: IncidentType[]) => {
        this.incidentTypes = incidentData;
        let incidentFound = false;
  
        this.incidentTypeMap = {};
        incidentData.forEach(incident => {
          this.incidentTypeMap[incident.incident_id] = incident.name;
          if (this.selectedIncidentID === incident.incident_id) {
            this.incidentName = incident.name;
            incidentFound = true; 
            console.log('Incident Name Filtered:', this.incidentName);
          }
        });
  
        resolve(); // Resolve the promise when done
      }, error => {
        console.error('Error loading incident types', error);
        reject(error); // Reject the promise on error
      });
    });
  }

  

  loadTotalCrimeDensity() {
    let totalDensity = 0;
  
    this.locationService.getCoordinates().subscribe((coordinatesData: any[]) => {
      coordinatesData.forEach((data) => {
        totalDensity += data.density;  
        // console.log('Total Density', totalDensity)
      });
      this.totalCrimes = totalDensity;
      
    }, error => {
      console.error('Error loading coordinates and density', error);
      // console.log('Total Density', totalDensity)
    });
  }

  
clearSelection(){
  this.selectedBarangays = [];
  console.log('Selected Barangays cleared');
  this.selectedIncidentID = 0; 
  console.log('Selected Crimes cleared');
  this.total_incidents = 0;

}

refreshAllCrimes(){
  const applyFilter = false;
  this.initializeMap(applyFilter);
  this.total_incidents = 0;

  this.closeFilterModal();
}


openFilterModal() {
  this.isFilterModalOpen = true;
}

closeFilterModal() {
  this.isFilterModalOpen = false;
}

applyFilter() {
  console.log('Selected Incident ID:', this.selectedIncidentID);

  // Check if an incident ID is selected
  if (!this.selectedIncidentID) {
    console.warn('No incident ID selected');
    return; // Exit if no incident is selected
  }


  const applyFilter = true;
  this.initializeMap(applyFilter);

 
  this.closeFilterModal();
}

// onChangeIncident() {

//   if (!this.selectedIncidentID) {
//     console.warn('No incident ID selected');
//     return;
//   }else {
//     console.log ('Selected Incident:', this.selectedIncidentID)
//   }

//   this.barangays = [];

// let barangayIncidentCountMap: { [key: string]: number } = {}

//   this.locationService.getFullCoordinates(this.selectedIncidentID).subscribe(
//     async (responses: Cluster[]) => {
//       console.log('Coordinates fetched for incident:', responses);

//       const barangaySet: Set<string> = new Set();


//       for (const cluster of responses) {
//         if (cluster.coordinates) {
//           for (const coord of cluster.coordinates) {
//             const barangayName = await this.getLocationName(coord.latitude, coord.longitude);

//             if (barangayName) {
//               barangaySet.add(barangayName);

//               if (!barangayIncidentCountMap[barangayName]) {
//                 barangayIncidentCountMap[barangayName] = 0;
//               }
//               barangayIncidentCountMap[barangayName]++;
//             }
//           }
//         }
//       }

//       this.barangays = Array.from(barangaySet);
//       this.barangays.sort((a, b) => a.localeCompare(b));
//       this.incidentCountPerBarangay = barangayIncidentCountMap;
//       console.log('Incident Count per Barangay:', this.incidentCountPerBarangay);
//     },
//     (error) => {
//       console.error('Error fetching coordinates:', error);
//     }
//   );
//   }

  onChangeIncident() {

    if (!this.selectedIncidentID) {
      console.warn('No incident ID selected');
      return;
    }else {
      console.log ('Selected Incident:', this.selectedIncidentID)
    }
  
    this.barangays = [];
  
  let barangayIncidentCountMap: { [key: string]: number } = {}
  
    this.locationService.getFullCoordinates(this.selectedIncidentID).subscribe(
      async (responses: Cluster[]) => {
        console.log('Coordinates fetched for incident:', responses);
  
        const barangaySet: Set<string> = new Set();
  
  
        for (const cluster of responses) {
          if (cluster.coordinates) {
            for (const coord of cluster.coordinates) {
              const barangayName = coord.barangay;
  
              if (barangayName) {
                barangaySet.add(barangayName);
  
                if (!barangayIncidentCountMap[barangayName]) {
                  barangayIncidentCountMap[barangayName] = 0;
                }
                barangayIncidentCountMap[barangayName]++;
              }
            }
          }
        }
  
        this.barangays = Array.from(barangaySet);
        this.barangays.sort((a, b) => a.localeCompare(b));
        this.incidentCountPerBarangay = barangayIncidentCountMap;
        console.log('Incident Count per Barangay:', this.incidentCountPerBarangay);
      },
      (error) => {
        console.error('Error fetching coordinates:', error);
      }
    );
    }
  
  

  


}
