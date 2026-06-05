import { Component, AfterViewInit, inject, input, effect, DestroyRef, Injector } from '@angular/core';
import * as L from 'leaflet';
import { Restaurant } from '../../../shared/models/restaurant';
@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map implements AfterViewInit {
  restaurants = input.required<Restaurant[]>();
  private map!: L.Map;
  private markersLayer = L.layerGroup();

  // l'injecteur d'Angular ici 
  private injector = inject(Injector);

  constructor() {
    // moderne ngOnDestroy
    inject(DestroyRef).onDestroy(() => {
      if (this.map) {
        this.map.remove();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    // passe l'injecteur à l'effet pour l'autoriser hors du constructeur
    effect(() => {
      // On lit le signal
      const restos = this.restaurants();
      // On ne rafraîchit que si la carte Leaflet est initialisée
      if (this.map) {
        this.refreshMarkers();
      }
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
    console.log("Restaurants reçus par la carte :", this.restaurants());

    this.markersLayer.clearLayers();

    this.restaurants().forEach(resto => {
      const rating = resto.ratingAvg || 0;
      let iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';

      if (rating == 5) {
        iconUrl = 'https://thumbs2.imgbox.com/fd/cd/DzgWCpiu_t.png';
      } else if (rating >= 4) {
        iconUrl = 'https://thumbs2.imgbox.com/00/45/dQLO36D6_t.png';
      } else if (rating >= 3) {
        iconUrl = 'https://thumbs2.imgbox.com/e8/01/hi9YUcUh_t.png';
      } else if (rating >= 1) {
        iconUrl = 'https://thumbs2.imgbox.com/76/e7/NgbxVSTI_t.png';
      }

      const customIcon = L.icon({
        iconUrl,
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      });

      // Boucle sur les restaurants pour ajouter les marqueurs
      if (resto.latitudeEtlongitude && resto.latitudeEtlongitude.length === 2) {
        const marker = L.marker(resto.latitudeEtlongitude, { icon: customIcon });

        // Ajoute une popup au CLIC
        marker.bindPopup(`<div class="p-1">
          <h3 class="font-bold text-sm m-0">${resto.name}</h3>
          <p class="text-xs text-gray-600 m-0 mt-1">${resto.address || ''}</p>
          <div class="mt-2 text-xs font-semibold">Note : ${rating}/5</div>
        </div>`);
        // au survol (hover) sans cliquer
        marker.bindTooltip(`<b>${resto.name}</b>`, { permanent: false, direction: 'top' })

        marker.addTo(this.markersLayer);
      }
    });
  }
}
