import { Component, AfterViewInit, inject, OnInit, signal } from '@angular/core';
import * as L from 'leaflet';
import { RestaurantService } from '../../../core/services/restaurant-service';
import { Restaurant } from '../../../shared/models/restaurant';
@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map implements OnInit, AfterViewInit {
  private restaurantService = inject(RestaurantService);
  private map!: L.Map
  restaurants = signal<Restaurant[]>([]);

  ngOnInit(): void {
    // 1. On lance la requête vers le Back Java le plus tôt possible
    this.restaurantService.getApprovedRestaurants().subscribe({
      next: (data) => {
        this.restaurants.set(data);
        // Si la carte est déjà prête dans le DOM, on met les marqueurs
        if (this.map) {
          this.addMarkers();
        }
      },
      error: (err) => console.error('Erreur API Java :', err)
    });
  }

  ngOnDestroy(): void {
    // Nettoie la carte pour éviter les fuites de mémoire
    if (this.map) {
      this.map.remove();
    }
  }
  
  ngAfterViewInit(): void {
    // 2. Garanti que la div #map existe, peu importe la page d'où vient l'utilisateur
    this.initMap();
    // Si l'API Java a répondu super vite et que les données sont déjà là
    if (this.restaurants().length > 0) {
      this.addMarkers();
    }
  }

  private initMap(): void {
    this.map = L.map('map').setView([48.863401859425366, 2.3464784947063326], 12);
    // Leaflet: "moteur" de carte vide, ce lien pour télécharger des milliers des Tiles
    // {s} : Le sous-serveur (a, b, ou c) pour charger les images plus vite.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, // >19: où OpenStreetMap n'a plus d'images à proposer
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  private addMarkers(): void {
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });


    // Boucle sur les restaurants pour ajouter les marqueurs
    this.restaurants().forEach(resto => {
      if (resto.latitudeEtlongitude && resto.latitudeEtlongitude.length === 2) {
        const marker = L.marker(resto.latitudeEtlongitude, { icon: defaultIcon });

        // Ajoute une popup au CLIC
        marker.bindPopup(`<b>${resto.name}</b><br>${resto.address || ''}`);
        // au survol (hover) sans cliquer
        marker.bindTooltip(`<b>${resto.name}</b>`, { permanent: false, direction: 'top' })

        marker.addTo(this.map);
      }
    });
  }
}
