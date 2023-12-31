import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate,NavLink } from 'react-router-dom';
import { RiHomeSmileLine } from 'react-icons/ri';
import PriceFilter from '../pages/PriceFilter';
import { HiArrowsRightLeft } from 'react-icons/hi2';
import { PiSwimmingPool } from 'react-icons/pi';
import { RiHomeLine } from 'react-icons/ri';
import { MdCabin } from 'react-icons/md';
import { PiHouseLine } from 'react-icons/pi';
import { FaMountainCity } from 'react-icons/fa6';
import Donde from '../pages/modalWhere';
import modalAnf from './modalAnf';
import ModalPrueba from './modalprueba';
import { DatePicker } from 'antd';
import moment from 'moment';
import Fechas from './fechas';
import LugarBoton from './lugares/lugarboton';
import CuantosBoton from './cuantos/botoncuantos';
import MenuBoton from './menú/botonMenu';
import '../pages/css/nav.css';
import BusquedaBoton from './busqueda/busquedaBoton';
import HabilitarBoton from './habilitar/botonhabilitar';;
const { RangePicker } = DatePicker;

function NavbarReg() {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showModoAnfPopup, setShowModoAnfPopup] = useState(false);
  const [destino, setDestino] = useState(localStorage.getItem('destino') || '');
  const [tipo, setTipo] = useState(localStorage.getItem('tipo') || '');

  useEffect(() => {
    const checkLocalStorageChangeInterval = setInterval(() => {
      const nuevoDestino = localStorage.getItem('destino');
      if (nuevoDestino !== destino) {
        setDestino(nuevoDestino);
      }

      const nuevoTipo = localStorage.getItem('tipo');
      if (nuevoTipo !== tipo) {
        setTipo(nuevoTipo);
      }
    }, 1000);

    return () => {
      clearInterval(checkLocalStorageChangeInterval);
    };
  }, [destino, tipo]);

  const navigate = useNavigate();

  const toggleFilterPopup = () => {
    setShowFilterPopup((prevShowFilterPopup) => !prevShowFilterPopup);
  };

  const handleReloadTarija = () => {
    navigate(`/busqueda`);
    console.log(localStorage.getItem("camas"))
  };

  const toggleModoAnfPopup = () => {
    setShowModoAnfPopup((prevShowModoAnfPopup) => !prevShowModoAnfPopup);
  };

  return (
    <>
      <header style={{position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: '#fff', zIndex: 100,}}>
        <div id="head">
              <div id="head-izq">
                    <div id="logoT">
                          <i id="logoP">
                            <RiHomeSmileLine />
                          </i>
                    </div>
                    <div id="logoL">
                            <a id="TelosSuite">TelosSuite</a>
                            <a id="TS">TS</a>
                      </div>
              </div>
              <div id="buscador">
                    <li id="prim">
                      <LugarBoton />
                    </li>
                    <li id="prim">
                      <Fechas />
                    </li>
                    <li>
                      <CuantosBoton />
                    </li>
              </div>
          
              <div className="verinm">
                <button onClick={handleReloadTarija}>BUSCAR</button>
              </div>

         
                  {parseInt(localStorage.getItem("init") )=== 1 &&(
                              <div id="head-der">
                                    <div id="head-der2">
                                      
                  { parseInt(localStorage.getItem("anfitrion") )=== 0 &&
                    (
                      <div id="head-der">
                            <div id="head-der2">
                                <HabilitarBoton></HabilitarBoton>
                            </div>
                      </div>
                    ) 
                    }
         
                    {parseInt(localStorage.getItem("anfitrion") )=== 1 &&
                    (
                      <div id="head-der">
                          <div id="head-der2">
                              <Link to='/cliente'>Modo anfitrion</Link>
                          </div>
                      </div>
                                ) 
                    }
                   </div>
                   <div id='head-der3'>
                                <MenuBoton />
                            </div>
                    </div>
                    ) 
                    }
            {parseInt(localStorage.getItem("init") )=== 0 &&(
                                  <div id="head-der">
                            
                                  <nav id='nav-menu'>
                                      <MenuBoton />
                                  </nav>
                            </div>
                    ) 
                    }

        </div>
      <div id="navAbajo"  style={{backgroundColor: 'black'}}>
          LLALKASLSAKKLSALAKSLAKLAKSLK
          
      </div>
      </header>
      <body>
        {showFilterPopup && <PriceFilter />}
        {showModoAnfPopup && <modalAnf />}
      </body>
      <Outlet />
    </>
  );
}
  export default NavbarReg;