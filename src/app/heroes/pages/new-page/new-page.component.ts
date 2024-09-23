import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Publisher, Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

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
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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
          this.showSnackbar(`${hero.superhero} ha sido actualizado!`)
        }
        );
      return;
    }

    this.heroesServices.addHero(hero)
      .subscribe(hero => {
        //TODO snackbar y redireccionar a /heroes/edit/hero.id
        this.router.navigateByUrl(`/heroes/edit/${hero.id}`);
        this.showSnackbar(`${hero.superhero} ha sido creado`);
      });
    return;
  }

  onDeleteHero():void{

    if(!this.currentHero.id) throw Error ('Se requiere un ID de un héroe')

      const dialogRef = this.dialog.open(ConfirmDialogComponent,{
        data: this.heroForm.value
      });

      dialogRef.afterClosed()
      .pipe(
        filter((result:boolean) => result === true),
        switchMap( () => this.heroesServices.deleteHero(this.currentHero.id)),
        filter((eliminado:boolean) => eliminado)
      )
      .subscribe(() =>{
        this.router.navigateByUrl('/heroes');
      });

      // Funciona pero el código es algo confuso
      // dialogRef.afterClosed().subscribe(result =>{
      //   if( !result )return;

      //   this.heroesServices.deleteHero(this.currentHero.id)
      //     .subscribe( eliminado =>{
      //       if(eliminado)
      //         this.router.navigateByUrl('/heroes')
      //     });
      // })


  }

  showSnackbar(mensaje:string):void{

    this.snackBar.open( mensaje, 'OK', {
      duration: 2500,
    })
  }

}
