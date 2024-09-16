import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Publisher, Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { switchMap } from 'rxjs';
import { subscribe } from 'diagnostics_channel';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html'
})
export class NewPageComponent implements OnInit {


  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl('')
  })
  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ]

  constructor(
    private heroesServices: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesServices.getHeroesById(id))
      ).subscribe(hero => {
        if (!hero) {
          return this.router.navigateByUrl('/')
        }

        this.heroForm.reset(hero);
        return;
      }
      )
  }

  get currentHero(): Hero {

    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {

    if (this.heroForm.invalid) return;

    const hero = this.currentHero;

    if (this.currentHero.id) {

      this.heroesServices.updateHero(hero)
        .subscribe(hero => {

          //TODO SNACKBAR
        }
        );
      return;
    }

    this.heroesServices.addHero(hero)
      .subscribe(hero => {
        //TODO snackbar y redireccionar a /heroes/edit/hero.id
      });
    return;
  }


}
