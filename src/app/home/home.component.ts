import { Component } from '@angular/core';
import { SongkickService } from '../services/songkick.service';
import { Event } from '../models/event-model';
import { SpotifyService } from '../services/spotify.service'
import { Artist } from '../models/artist-model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[ SongkickService, SpotifyService ]
})

export class HomeComponent {
  public showLocationQuery: string;
  public showLocationId: string;
  public showLocation$: Observable<any>;
  public showlocations$: Observable<any[]>;
  public showMaxDate: string;
  public showMinDate: string;


  constructor(private  songkickService: SongkickService, public spotifyService: SpotifyService, public client: HttpClient) {}

  findCityIdFromSongkick() {
    console.log('findCityIdFromSongkick() running...');
    this.showLocation$ = this.songkickService.getLocationIdFromAPI(this.showLocationQuery);
    return this.songkickService.getLocationIdFromAPI(this.showLocationQuery).map((response) => {
      this.showLocationId = response.resultsPage.results.location[0].metroArea.id;
      return response.resultsPage.results.location[0].metroArea.id
    })
  }

//This function should change to use map instead of subscribe, we use subecribe for troubleshooting to log the outputs

  findListOfShowsByCityIdAndDateRange(location:string, minDate: string, maxDate: string) {
    console.log('findListOfShowsByCityIdAndDateRange() running...');
    this.showLocationQuery = location;
    return this.findCityIdFromSongkick()
    .subscribe((idResponse) => {
      return this.songkickService.getShowListByCityIdAndDateRangeFromAPI(idResponse, this.showMinDate, this.showMaxDate)
      .subscribe((showListResponse) => {
        console.log(showListResponse);
        this.showlocations$ = showListResponse.resultsPage.results.event;
        return showListResponse.resultsPage.results.event
      });
    })
  }

  generateArrayOfHeadlinerPerformances(location:string, minDate: string, maxDate: string){
    console.log('generateArrayOfHeadlinerPerformances() running...');
    this.showLocationQuery = location;
    this.showMinDate = minDate;
    this.showMaxDate = maxDate;
    this.findListOfShowsByCityIdAndDateRange().get((showListResponse) => {
      console.log(showListResponse);
    });
  }
}
