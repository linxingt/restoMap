import { Component, AfterViewInit, inject, input, effect, DestroyRef, Injector, ChangeDetectionStrategy } from '@angular/core';
import * as L from 'leaflet';
import { Restaurant } from '../../../shared/models/restaurant';
import { Router } from '@angular/router';
@Component({
  selector: 'app-restaurant-map',
  imports: [],
  templateUrl: './restaurant-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantMapComponent implements AfterViewInit {
  restaurants = input.required<Restaurant[]>();
  targetId = input<string | null>(null);

  autoFlyTo = input<boolean>(false);

  private map!: L.Map;
  private markersLayer = L.layerGroup();
  private markerMap = new Map<string, L.Marker>();
  private injector = inject(Injector);
  private router = inject(Router);

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.map) {
        this.map.remove();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    effect(() => {
      if (this.map) {
        this.refreshMarkers();
      }
    }, { injector: this.injector });

    effect(() => {
      const activeId = this.targetId();
      this.markerMap.forEach((marker, id) => {
        if (id === activeId) {
          marker.openTooltip();
        } else {
          marker.closeTooltip();
        }
      });
    }, { injector: this.injector });
  }

  private initMap(): void {
    this.map = L.map('map', { zoomControl: false }).setView([48.863401859425366, 2.3464784947063326], 12);
    // Leaflet: "moteur" de carte vide, ce lien pour télécharger des milliers des Tiles
    // {s} : Le sous-serveur (a, b, ou c) pour charger les images plus vite.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, // >19: où OpenStreetMap n'a plus d'images à proposer
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);

    L.control.zoom({
      position: 'bottomleft'
    }).addTo(this.map);
  }

  private refreshMarkers(): void {
    this.markersLayer.clearLayers();
    this.markerMap.clear();

    const currentList = this.restaurants();
    if (!currentList || currentList.length === 0) return;

    currentList.forEach(resto => {
      const coords = resto.latitudeEtlongitude;
      const lat = coords?.[0];
      const lng = coords?.[1];

      if (!resto.id || lat == null || lng == null || isNaN(lat) || isNaN(lng)) return;
      const rating = resto.ratingAvg || 0;
      let iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';

      if (rating >= 4) {
        iconUrl = 'greenSpoon.png';
      } else if (rating >= 3) {
        iconUrl = 'yellowSpoon.png';
      } else if (rating >= 0.01) {
        iconUrl = 'redSpoon.png';
      } else
        iconUrl = 'blueSpoon.png';

      const customIcon = L.icon({
        iconUrl,
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 35],
        iconAnchor: [12, 35],
        popupAnchor: [1, -30],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // popup au CLIC
      // marker.bindPopup(`<div></div>`);
      // au survol (hover)
      marker.bindTooltip(`
        <div class="p-3 bg-white border-2 border-black rounded-2xl shadow-none">
          <h3 class="font-bold text-sm text-black m-0">${resto.name}</h3>
          <p class="text-xs text-[#834008] m-0 mt-1">${resto.address || ''}</p>
          <div class="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-[#EDC87F]/20 text-[#834008] border border-black/10">
            <span>${resto.ratingAvg ? resto.ratingAvg.toFixed(1) + " ★" : 'N/A'} </span>
          </div>
        </div>
        `, { permanent: false, direction: 'top', offset: [0, -25] })

      marker.on('click', () => {
        this.router.navigate([
          '/restaurants/detail',
          resto.slug,
          resto.id
        ]);
      });

      marker.addTo(this.markersLayer);
      this.markerMap.set(resto.id, marker);
    });

    if (this.autoFlyTo()) {
      const firstValidResto = currentList.find((resto) => {
        const lat = resto.latitudeEtlongitude?.[0];
        const lng = resto.latitudeEtlongitude?.[1];
        return lat != null && lng != null && !isNaN(lat) && !isNaN(lng);
      });

      if (firstValidResto && firstValidResto.latitudeEtlongitude) {
        const [targetLat, targetLng] = firstValidResto.latitudeEtlongitude;
        this.map.flyTo([targetLat, targetLng], 17, {
          animate: true,
          duration: 1.2
        });
      }
    }

    setTimeout(() => this.map.invalidateSize(), 100);
  }
}
