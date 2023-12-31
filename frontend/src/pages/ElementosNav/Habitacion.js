import React, { Component } from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../../CSS/cards.css';
import ModalInicio from '../../components/inicioSesion/inicio';
import axios from "axios";
import Slider from 'react-slick';
import iconocorazon1 from '../../iconos/corazon1.png';
import iconocorazon2 from '../../iconos/corazon2.png';
import 'slick-carousel/slick/slick.css';
import '../../CSS/slick.css'
class Habitacion extends Component {
  constructor(props){
    super(props);
    this.state={
      inmueble:[],
      favorites: [],
      showLoginModal: false,
    };
   
    
}
 
componentDidMount() {
  const userID = localStorage.getItem('userID');
  
    this.getProductos();
    this.getFavorites(userID);

}
getFavorites = async (userID) => {
  try {
    const response = await axios.get(`https://telossuite.amicornios.com/api/getfavoritos/${userID}`);
    this.setState({ favorites: response.data });
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
  }
};


getProductos = async (pausado) => {
  const { fechaini, fechafin } = localStorage;
  const startDate = new Date(fechaini);
  const endDate = new Date(fechafin);

  try {
    const inmueblesResponse = await axios.get('https://telossuite.amicornios.com/api/getinmuebles');
    const reservasResponse = await axios.get('https://telossuite.amicornios.com/api/getreserva');

    const inmuebles = inmueblesResponse.data;
    const reservas = reservasResponse.data;

    const inmueblesDisponibles = inmuebles.filter((inmueble) => {
      const reservasInmueble = reservas.filter((reserva) => reserva.idinmueble === inmueble.idinmueble);

      const tieneReserva = reservasInmueble.some((reserva) => {
        const reservaStartDate = new Date(reserva.fechaini);
        const reservaEndDate = new Date(reserva.fechafin);

        return (
         ( (startDate >= reservaStartDate && startDate <= reservaEndDate) ||
          (endDate >= reservaStartDate && endDate <= reservaEndDate) ||
          (startDate <= reservaStartDate && endDate >= reservaEndDate)) 

         && reserva.estado ==="aceptado" 
        );
      });

      return !tieneReserva;
    });

    this.setState({ inmueble: inmueblesDisponibles });
    console.log(inmueblesDisponibles);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};



toggleFavorite = async (sitio) => {
  const userID = localStorage.getItem('userID');
  const sitioId = sitio.idinmueble;

  if (parseInt(localStorage.getItem('init')) === 1) {
    try {
      let response;
      if (sitioId) {
        const isFavorite = this.state.favorites.find(fav => fav.idinmueble === sitioId);
        if (isFavorite) {
          response = await axios.delete(`https://telossuite.amicornios.com/api/delfavoritos/${userID}/${sitioId}`);
          if (response.status === 200) {
            const updatedFavorites = this.state.favorites.filter(fav => fav.idinmueble !== sitioId);
            this.setState({ favorites: updatedFavorites });
          } else {
            console.error('Error al eliminar favorito en el servidor');
          }
        } else {
          response = await axios.post('https://telossuite.amicornios.com/api/postfavorito', {
            idinmueble: sitioId,
            idusuario: userID,
          });
          if (response.status === 200) {
            const newFavorite = {
              idinmueble: sitioId,
              
            };
            this.setState(prevState => ({ favorites: [...prevState.favorites, newFavorite] }));
          } else {
            console.error('Error al agregar favorito en el servidor');
          }
        }
      } else {
        console.error('sitioId is missing or empty');
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
    }
  } else {
    console.log('Inicia sesión');
    this.setState({ showLoginModal: true });
  }
};

  render() {
    const { favorites, showLoginModal, inmueble } = this.state;
   
    const carouselSettings = {
      
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows:true
      
    };
    const minPrice = parseInt(localStorage.getItem('precioMinimo'), 10) || 0;
    const maxPrice = parseInt(localStorage.getItem('precioMaximo'), 10) || Infinity;
    const tipoInmueblePrivado = localStorage.getItem('privado') === '1';
    const tipoInmuebleCompartido = localStorage.getItem('compartido') === '1';
    const habitacionesSeleccionadas = localStorage.getItem('habitaciones') !== 'Cualquiera' ? parseInt(localStorage.getItem('habitaciones'), 10) : null;
    const camasSeleccionadas = localStorage.getItem('camas') !== 'Cualquiera' ? parseInt(localStorage.getItem('camas'), 10) : null;
    const bañosSeleccionados = localStorage.getItem('baños') !== 'Cualquiera' ? parseInt(localStorage.getItem('baños'), 10) : null;
    const filtroWifi = parseInt(localStorage.getItem('wifi'), 10);
    const filtroParqueo = parseInt(localStorage.getItem('parqueo'), 10);
    const filtroCocina = parseInt(localStorage.getItem('cocina'), 10);
    const filtroRefrigerador = parseInt(localStorage.getItem('refrigerador'), 10);
    const filtroLavadora = parseInt(localStorage.getItem('lavadora'), 10);
    const filtroPiscina = parseInt(localStorage.getItem('piscina'), 10);
    const algunFiltroActivado = filtroWifi || filtroParqueo || filtroCocina || filtroRefrigerador || filtroLavadora || filtroPiscina;

    return (
      <>
        <body>
          <div className="verinm">
            {this.state.inmueble.map((sitio, index) => {
              const fechaIni = new Date(localStorage.getItem("fechaini"));
              const fechaFin = new Date(localStorage.getItem("fechafin"));
              const fechainicio = new Date(sitio.fechainicio);
              const fechafin = new Date(sitio.fechafin)
               const precioSitio = parseInt(sitio.precio, 10);
               const esPrivado = parseInt(sitio.privado, 10) === 1;
              const esCompartido = parseInt(sitio.compartido, 10) === 1; 
               const habitacionesSitio = parseInt(sitio.habitaciones, 10);
              const camasSitio = parseInt(sitio.camas, 10);
              const bañosSitio = parseInt(sitio.baños, 10);
              const cumpleCondicionesServicios = 
              (!algunFiltroActivado) || 
              (filtroWifi && sitio.wifi) ||
              (filtroParqueo && sitio.parqueo) ||
              (filtroCocina && sitio.cocina) ||
              (filtroRefrigerador && sitio.refrigerador) ||
              (filtroLavadora && sitio.lavadora) ||
              (filtroPiscina && sitio.piscina);
              const estaPausado = (fechaIni>= fechainicio && fechaIni <= fechafin) ||
              (fechaFin >= fechainicio && fechaFin <= fechafin) ||
              (fechaIni <= fechainicio && fechaFin >= fechafin)
              console.log(estaPausado);
              if(sitio.tipopropiedad === "Habitación" &&
                
                 sitio.ciudad === localStorage.getItem("destino") &&
                 sitio.niños === parseInt(localStorage.getItem("niños")) &&
                 sitio.mascotas === parseInt(localStorage.getItem("mascotas")) &&
                 sitio.capacidad === parseInt(localStorage.getItem("huespedes")) &&
                 precioSitio >= minPrice &&
                 precioSitio <= maxPrice&&
                 ((!tipoInmueblePrivado && !tipoInmuebleCompartido) || // No se seleccionó filtro de tipo
             (tipoInmueblePrivado && esPrivado) ||
             (tipoInmuebleCompartido && esCompartido))&&
             (habitacionesSeleccionadas === null || habitacionesSitio <= habitacionesSeleccionadas) &&
             (camasSeleccionadas === null || camasSitio >= camasSeleccionadas) &&
             (bañosSeleccionados === null || bañosSitio >= bañosSeleccionados)&&
             (!estaPausado) &&
                 cumpleCondicionesServicios
             ) {
              const isFavorite = favorites.some(fav => fav.idinmueble === sitio.idinmueble);
             
                    return (
                        <div className="InmueblesHost" key={sitio.id}>
                           <Slider {...carouselSettings}>
                      <div>
                        <img className="inmueble_fot" src={sitio.imagen1} alt="Inmueble 1" />
                      </div>
                      <div>
                       <img className="inmueble_fot" src={sitio.imagen2} alt="Inmueble 2" />
                      </div>
                      <div>
                        <img className="inmueble_fot" src={sitio.imagen3} alt="Inmueble 1" />
                      </div>
                      <div>
                        <img className="inmueble_fot" src={sitio.imagen4} alt="Inmueble 1" />
                      </div>
                      <div>
                        <img className="inmueble_fot" src={sitio.imagen5} alt="Inmueble 1" />
                      </div>
                  </Slider>
                  <h3 className="inmueble_name">{sitio.tipopropiedad} en {sitio.ciudad}</h3>
                    <div className="inmueble_info">
                      <p className="inmDet">{sitio.titulo}</p>
                      {
                        sitio.compartido === 1 &&
                        <p className="inmPrecio"><b>Compartido</b></p>
                   
                      }
                       {
                        sitio.privado === 1 &&
                        <p className="inmPrecio"><b>Privado</b></p>
                   
                      }
                      <p className="inmCamas"> <b>Precio por noche:</b> bs. {sitio.precio}</p>
                      <p className="inmPrecio"><b>Capacidad:</b>  {sitio.capacidad} persona(s)</p>
                      <p className="inmPrecio"><b>Normas:</b> {sitio.normas}</p>
                      {
                        sitio.niños === 1 &&
                        <p className="inmPrecio"><b>Se permiten niños</b></p>
                   
                      }
                       {
                        sitio.mascotas === 1 &&
                        <p className="inmPrecio"><b>Se permiten mascotas</b></p>
                   
                      }
                       {
                        sitio.niños === 0 &&
                        <p className="inmPrecio"><b>NO se permiten niños</b></p>
                   
                      }
                       {
                        sitio.mascotas === 0 &&
                        <p className="inmPrecio"><b>NO se permiten mascotas</b></p>
                   
                      }
                   
                    </div>
                    <button
                    onClick={() => this.toggleFavorite(sitio)}
                    className={isFavorite ? 'favorite-button active' : 'favorite-button'}
                  >
                    <img
                      src={isFavorite ? iconocorazon2 : iconocorazon1}
                      alt={isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
                    />
                  </button>
                  <div className='BotonMasDetalles'>
                      <Link to={`/vistaInm/${sitio.idinmueble}`}>Ver más</Link>
                    </div>
                     
                        </div>
                      );
                }
               
              
              return null;
            })}
          </div>
          {showLoginModal && (
            <ModalInicio isOpen={showLoginModal} onClose={() => this.setState({ showLoginModal: false })}>
              <ModalInicio.Header> </ModalInicio.Header>
              <ModalInicio.Body />
              <ModalInicio.Footer />
            </ModalInicio>
          )}
        </body>
        <Outlet />
      </>
    );
  }
}

export default Habitacion;