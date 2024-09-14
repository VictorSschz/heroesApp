import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroesService } from '../../services/heroes.service';
import { switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
})
export class HeroPageComponent implements OnInit {

  public hero? : Hero;

  constructor(
    private heroesServices:  HeroesService,
    private activatedRouter: ActivatedRoute,
    private router:          Router
  ) { }


  ngOnInit(): void {
    this.activatedRouter.params
      .pipe(
        switchMap(({ id }) => this.heroesServices.getHeroesById(id)),
      ).subscribe(
        hero => {
          if (!hero) return this.router.navigate(['heroes/list']);

          this.hero = hero;
          return;
        })
  }

  goBack(){
    this.router.navigateByUrl('heroes/list');
  }

}
