import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as mapboxgl from 'mapbox-gl';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  regions: any[] = [];
  provinces: any[] = [];
  cities: any[] = [];
  municipalities: any[] = [];
  barangays: any[] = [];
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  times: string[] = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
  stations: string[] = ["PS 01", "PS 02", "PS 03", "PS 04", "PS 05", "PS 06", "PS 07", "PS 08", "PS 09", "PS 10", "PS 11"];
  stationNames: string[] = ["Punta Princesa", "Talamban", "Mabolo", "Pasil", "Pardo", "Carbon", "Guadalupe", "Mambaling", "Abellana", "Pari-An", "Waterfront"];
  generalTimes: string[] = ["AFTERNOON", "MORNING", "EVENING"];
  dayNames: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
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
  map!: mapboxgl.Map;
  crimeLayerId = 'crime-data-50z6kq';

  constructor(
    private http: HttpClient,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.mapbox.com/styles/v1/mimsh23/clzxshvrk004g01rb21e17pa5.html?title=copy&access_token=pk.eyJ1IjoibWltc2gyMyIsImEiOiJjbHltZ2F3MTIxbWY2Mmtvc2YyZXd0ZWF1In0.YP4QQgS9F_Mqj3m7cB8gLw&zoomwheel=true&fresh=true#11.38/10.3001/123.8667'; 
    document.head.appendChild(link);
    (mapboxgl as any).accessToken = environment.mapboxKey;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mimsh23/clzxshvrk004g01rb21e17pa5',
      center: [123.880283, 10.324278],
      zoom: 10
    });

    this.map.addControl(new mapboxgl.NavigationControl());
    this.loadCrimeData();
  }

  loadCrimeData() {
    this.map.on('load', () => {
        const crimeDataUrl = 'assets/crime_data.geojson';

        this.http.get(crimeDataUrl).subscribe((data: any) => {
            if (data && data.type === 'FeatureCollection') {
                
                if (!this.map.getSource('crime-data')) {
                    this.map.addSource('crime-data', {
                        type: 'geojson',
                        data: data,
                    });
                }

                if (!this.map.getLayer('crime-data-50z6kq')) {
                    this.map.addLayer({
                        id: 'crime-data-50z6kq', 
                        type: 'heatmap',
                        source: 'crime-data', 
                        paint: {
                            'heatmap-radius': 20,
                        },
                        filter: ["all"] 
                    });
                }

                this.filterData();
            } else {
                console.error('Invalid GeoJSON data:', data);
            }
        }, error => {
            console.error('Error loading GeoJSON data:', error);
        });
    });
}


  filterData() {
    let filters: any[] = ["all"];

    if (this.selectedMonth !== 'all') {
      filters.push(["match", ["get", "Month Name"], [this.selectedMonth], true, false]);
    }

    if (this.selectedStationCode !== 'all') {
      filters.push(["match", ["get", "STATION CODE"], [this.selectedStationCode], true, false]);
  }

  if (this.selectedDayName !== 'all') {
      filters.push(["match", ["get", "Day Name"], [this.selectedDayName], true, false]);
  }

  if (this.selectedStationName !== 'all') {
      filters.push(["match", ["get", "STATION NAME"], [this.selectedStationName], true, false]);
  }

  if (this.selectedGeneralTime !== 'all') {
      filters.push(["match", ["get", "GENERAL TIME"], [this.selectedGeneralTime], true, false]);
  }

    this.map.setFilter(this.crimeLayerId, filters);
  }

  onMonthChange(event: any) {
    this.selectedMonth = event.detail.value;
    this.filterData();
    console.log(this.selectedMonth);
  }

  onTimeChange(event: any) {
    this.selectedTime = event.detail.value;
    this.filterData();
    console.log(this.selectedTime);
  }

  onStationCodeChange(event: any) {
    this.selectedStationCode = event.detail.value;
    this.filterData();
    console.log(this.selectedStationCode);
  }

  onStationNameChange(event: any) {
    this.selectedStationName = event.detail.value;
    this.filterData();
    console.log(this.selectedStationName);
  }

  onGeneralTimeChange(event: any) {
    this.selectedGeneralTime = event.detail.value;
    this.filterData();
    console.log(this.selectedGeneralTime);
  }

  onDayNameChange(event: any) {
    this.selectedDayName = event.detail.value;
    this.filterData();
    console.log(this.selectedDayName);
  }

  resetFilters() {
    this.selectedMonth = 'all';
    this.selectedTime = 'all';
    this.selectedStationCode = 'all';
    this.selectedStationName = 'all';
    this.selectedGeneralTime = 'all';
    this.selectedDayName = 'all';
    this.filterData(); 
  }

  // onMunicipalityChange(event: any) {
  //   const municipalityId = event.detail.value; 
  //   this.selectedMunicipality = municipalityId; 
  //   console.log('Selected Municipality ID:', this.selectedMunicipality);

  //   this.locationService.getCebuBarangays().subscribe((barangayData) => {
  //     this.barangays = barangayData.filter(b => b.municipality_id === this.selectedMunicipality);
  //     console.log('Loaded Barangays:', this.barangays);
  //   });
  // }

  // onBarangayChange(event: any) {
  //   const barangayId = event.detail.value;
  //   this.selectedBarangay = this.barangays.find(b => b.barangay_id === barangayId); 
  //   console.log('Selected Barangay:', this.selectedBarangay);
  
  //   if (this.selectedBarangay) {
  //     const barangayName = this.selectedBarangay.barangay_name;
  //     console.log('Selected Barangay Name:', barangayName);
  //   }
  // }

  // loadBarangays() {
  //   this.locationService.getCebuBarangays().subscribe((barangayData) => {
  //     this.barangays = barangayData.filter(b => b.municipality_id === this.selectedMunicipality);
  //   });

  //   this.selectedBarangay = this.barangays;
  //   console.log(this.selectedBarangay);
  // }
}
