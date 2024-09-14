import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { EstadoService } from '../servicios/estado.service';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  usuario: any;
  formulario: FormGroup;
  showCalendar: boolean = false;
  contador: number = 0;

  constructor(
    private estadoService: EstadoService,
    public fb: FormBuilder,
    private router: Router,
    public alertController: AlertController,
    private animationCtrl: AnimationController // Agregamos el controlador de animaciones
  ) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nivelEducacion: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
    this.usuario = localStorage.getItem('f.usuario');
  }

  ngOnInit() {
    this.usuario = this.getUsuarioFromLocalStorage();
    console.log('ngOnInit el componente se ha inicializado');
    this.estadoService.contadorActual.subscribe(valor => {
      this.contador = valor;
      console.log('ngOnInit Contador Actualizado', this.contador);
    });
  }

  limpiar() {
    this.formulario.reset();
  }

  navigateTologin() {
    this.router.navigate(['/login']);
  }

  getUsuarioFromLocalStorage() {
    const usuarioString = localStorage.getItem('usuario');
    return usuarioString ? JSON.parse(usuarioString) : null;
  }

  async mostrar() {
    if (this.formulario.invalid) {
      const alert = await this.alertController.create({
        header: 'Formulario Incompleto',
        message: 'Por favor, complete todos los campos.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    const formData = this.formulario.value;

    const alert = await this.alertController.create({
      header: 'Datos Ingresados',
      message: `Nombre: ${formData.nombre}\nApellido: ${formData.apellido}\nNivel Educación: ${formData.nivelEducacion}\nFecha Nacimiento: ${formData.fechaNacimiento}`,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  ionViewWillEnter() {
    console.log('se ejecuta antes que la vista se muestre');
    console.log('ionViewWillEnter', this.contador);
  }

  ionViewDidEnter() {
    console.log('se ejecuta cuando la vista haya sido completamente cargada');
    console.log('ionViewDidEnter', this.contador);
  }

  ionViewWillLeave() {
    console.log('se ejecuta cuando la vista esta apunto de desaparecer');
    console.log('ionViewWillLeave', this.contador);
  }

  ionViewDidLeave() {
    console.log('se ejecuta cuando la vista ya desaparecio');
    console.log('ionViewDidLeave', this.contador);
  }

  ngOnDestroy() {
    console.log('se ejecuta cuando la vista esta a punto de ser destruido');
    console.log('ngOnDestroy', this.contador);
  }

  incrementarContador() {
    this.estadoService.incrementar();
  }

  navegarAOtraPagina() {
    this.router.navigate(['/otra-pagina']);
    this.estadoService.reiniciar();
  }

  animarBoton() {
    const boton = document.querySelector('.boton-animado');

    if (boton) {
      const animacion = this.animationCtrl.create()
        .addElement(boton)
        .duration(500)
        .fromTo('transform', 'scale(1)', 'scale(1.2)')
        .fromTo('background-color', '#000000', '#ff5722');
      animacion.play();
    } else {
      console.error("No existe la clase .boton-animado");
    }
  }

  animarTarjeta() {
    const tarjeta = document.querySelector('.tarjeta-animada');

    if (tarjeta) {
      const animacion = this.animationCtrl.create()
        .addElement(tarjeta)
        .duration(1000)
        .fromTo('transform', 'translateX(-100%)', 'translate(0%)')
        .fromTo('opacity', '0', '1');
      animacion.play();
    } else {
      console.error("No existe la clase .tarjeta-animada");
    }
  }
}
