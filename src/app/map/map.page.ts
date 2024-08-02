import { Component, OnInit, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as mapboxgl from 'mapbox-gl';
import { Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';
import * as L from 'leaflet';
// declare const mapboxgl: any;

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

  selectedRegion: any;
  selectedProvince: any;
  selectedCity: any;
  selectedMunicipality: any;
  map!: L.Map;


  constructor(private http: HttpClient, public plt: Platform) { }

 
  
  ngOnInit() {
    // (mapboxgl as any).accessToken = environment.mapboxKey;
    // this.map = new mapboxgl.Map({
    //     container: 'map', 
    //     //style: 'mapbox://styles/mapbox/streets-v12',
    //     center: [123.880283, 10.324278], 
    //     zoom: 10 // starting zoom
  
    // });
  
    // this.map.resize();
    // this.map.addControl(new mapboxgl.FullscreenControl());

    this.map = L.map('map', {
      center: [123.880283, 10.324278], 
      zoom: 20,
      renderer: L.canvas()
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map)
  }



  

  loadRegions() {
    this.http.get('location/table_region.json').subscribe((data: any) => {
      this.regions = data.regions;
    });
  }

  onRegionChange(event: any) {
    const regionId = event.detail.value;
    this.selectedRegion = this.regions.find(region => region.id === regionId);
    this.provinces = this.selectedRegion ? this.selectedRegion.provinces : [];
    this.cities = [];
    this.municipalities = [];
    this.selectedProvince = null;
    this.selectedCity = null;
    this.selectedMunicipality = null;
  }

  onProvinceChange(event: any) {
    const provinceId = event.detail.value;
    this.selectedProvince = this.provinces.find(province => province.id === provinceId);
    this.cities = this.selectedProvince ? this.selectedProvince.cities : [];
    this.municipalities = [];
    this.selectedCity = null;
    this.selectedMunicipality = null;
  }

  onCityChange(event: any) {
    const cityId = event.detail.value;
    this.selectedCity = this.cities.find(city => city.id === cityId);
    this.municipalities = this.selectedCity ? this.selectedCity.municipalities : [];
    this.selectedMunicipality = null;
  }

  // ngAfterViewInit() {
   
  //   mapboxgl.accessToken = 'pk.eyJ1IjoibWltc2gyMyIsImEiOiJjbHltZ2F3MTIxbWY2Mmtvc2YyZXd0ZWF1In0.YP4QQgS9F_Mqj3m7cB8gLw';
  //   const map = new mapboxgl.Map({
  //       container: 'map', 
  //       //style: 'mapbox://styles/mimsh23/clz2a6pik00kd01pxerff4ok4/draft',
  //       center: [123.880283, 10.324278], 
  //       zoom: 10 // starting zoom

        
  //   });
  
  //   map.addControl(new mapboxgl.NavigationControl());
  // }

}
