/* eslint-disable jsx-a11y/anchor-is-valid */
import logo from '../img/LogoMarflex.png';
import avatar from '../img/IMG_20240617_223005.jpg';
import icono from '../img/forklift_30dp_DA954B_FILL0_wght400_GRAD0_opsz24.png';
import { useState } from 'react';
import './styles/HomeAdmin.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars,faXmark } from '@fortawesome/free-solid-svg-icons';
import Categoria from './Gestion_de_productos/Categoria';
import Productos from './Gestion_de_productos/Productos';
import Proveedores from './Gestion_de_productos/Proveedores';
import Usuarios from './Gestion_de_usuarios/Usuarios'
import MenuDePerfil from './MenuDePerfil';
import MateriasPrimas from './Gestion_de_MateriaPrima/MateriasPrimas';
import Reportes from './Gestion_de_Reportes/Reportes';








const HomeAdmin = () => {
  const [visibleComponents, setVisibleComponents] = useState({dashboard: true,  categorias: false, productos: false, Proveedores: false, Usuarios: false, Mprima: false, Reportes: false });
  const handleButtonClick = (componentName) => {
    setVisibleComponents(prevState => ({
      ...prevState,
      dashboard: componentName === 'dashboard',
      categorias: componentName === 'categorias',
      productos: componentName ===  'productos',
      Proveedores: componentName ===  'Proveedores',
      Usuarios: componentName ===  'Usuarios',
      menu: componentName === 'menu',
      Mprima: componentName === 'Mprima',
      Reportes: componentName === 'Reportes'
    }));
  };
 const [BtnMenu,setBtnMenu]=useState(false);
 
  return (
    <div className="App">
        <div className='App-body'>
        <header className="App-header">
        <nav className="barra-navegacion">
              <div className="logo"><img src={icono} alt="Logo de marflex"/><h1 className='h1-nav'>Inventario</h1></div>
              <div className="lista"><img src={logo} alt="Logo de marflex"/><h1 className='h1-nav'>Marflex</h1></div>
              <div><MenuDePerfil/></div>
          </nav>
        </header>
        <section className='mayor'>
        <FontAwesomeIcon onClick={() => setBtnMenu(!BtnMenu)} className='menu-amburguesa' icon={faBars}/>
        <section className='menu' style={{display: BtnMenu ? 'none' : 'block'}}>
          <div className="contenido-usuario">
                 <FontAwesomeIcon onClick={() => setBtnMenu(!BtnMenu)} className='Btn_ocultar' icon={faXmark} />
                  <img id="profile-pic" src= {avatar} alt="Foto de perfil" className="profile-pic"/>
                  <div className="perfil-nombre">
                      <p id="Nombre">REYNALDO MARTINEZ FUENTES</p>
                  </div>
          </div>
          <div className="contenido-menu">
              <div className="texto-menu"><h6>NAVEGACIÓN PRINCIPAL</h6></div>
          </div>

          <div className="sidebar">                                
              <ul>
                  <li onClick={() => handleButtonClick('dashboard')}><i className="fa-solid fa-chart-line"></i>Dashboard</li>
  
                  <MenuItem title="Gestión de Productos" icon="fas fa-cubes">
                  <li className="li-desplegable" onClick={() => handleButtonClick('categorias')}><a  className="item">Categorias</a></li>
                  <li className="li-desplegable" onClick={() => handleButtonClick('productos')}><a   className="item">Productos</a></li>
                  <li className="li-desplegable" onClick={() => handleButtonClick('Proveedores')}><a className="item">Proveedores</a></li>
                  
                  </MenuItem>
  
                  <li onClick={() => handleButtonClick('Reportes')}><i className="fas fa-chart-bar"></i> Reportes</li>
                  <li onClick={() => handleButtonClick('Mprima')}><i className="fa-regular fa-paste"></i> Gestión de Existencias</li>
            
                  <MenuItem title="Gestión de usuarios" icon="fas fa-users">
                  <li className="li-desplegable" onClick={() => handleButtonClick('Usuarios')}><a className="item">Usuarios</a></li>
                  </MenuItem>
  
                  <MenuItem title="Configuración" icon="fa-solid fa-gear">
                  <li className="li-desplegable"><a className="item">Cambiar contraseña</a></li>
                  </MenuItem>
              </ul>
          </div>
          
          </section>
  
          <section className="contenedor-universal">
          {visibleComponents.dashboard &&
            <article className="Dashboard">
            <div className="titulo"><p>Dashboard</p></div>
            <div className="card green"><div className="contenedor-icono users"><i id="icono" className="fa-solid fa-users"></i></div><div className="contenedor-span"><span className="label">Usuarios</span><span className="numero">16</span></div></div>
            <div className="card orange"><div className="contenedor-icono dolly"><i id="icono" className="fa-solid fa-dolly"></i></div><div className="contenedor-span"><span className="label">Proveedores</span><span className="numero">10</span></div></div>
              <div className="card red"><div className="contenedor-icono cajas"><i id="icono" className="fas fa-cubes"></i></div><div className="contenedor-span"><span className="label">Productos</span><span className="numero">185</span></div></div>
              <div className="card purple"><div className="contenedor-icono Factura"><i id="icono"className="fa-solid fa-file-invoice-dollar"></i></div><div className="contenedor-span"><span className="label">Facturas</span><span className="numero">$ 413</span></div></div>
              
              <div className="card blue"><div className="contenedor-icono Caja"><i id="icono"className="fa-solid fa-cube"></i></div><div className="contenedor-span"><span className="label">Existencia total</span><span className="numero">148</span></div></div>
              <div className="card pink"><div className="contenedor-icono Camion"><i id="icono"className="fa-solid fa-truck-fast"></i></div><div className="contenedor-span"><span className="label">Existencia vendida</span><span className="numero">33</span></div></div>
              <div className="card teal"><div className="contenedor-icono Bodega"><i id="icono"className="fa-solid fa-warehouse"></i></div><div className="contenedor-span"><span className="label">Existencia actual</span><span className="numero">115</span></div></div>
              <div className="card brown"><div className="contenedor-icono Cartera"><i id="icono"className="fa-solid fa-wallet"></i></div><div className="contenedor-span"><span className="label">Importe vendido</span><span className="numero">$ 413</span></div></div>
  
              <div className="card blue-2"><div className="contenedor-icono signo-dolar"><i id="icono"className="fa-solid fa-dollar-sign"></i></div><div className="contenedor-span"><span className="label">Importe pago</span><span className="numero">$ 413</span></div></div>
              <div className="card pink-2"><div className="contenedor-icono Mano"><i id="icono"className="fa-solid fa-hand-holding-dollar"></i></div><div className="contenedor-span"><span className="label">Importe restante</span><span className="numero">$ 0</span></div></div>
              <div className="card teal-2"><div className="contenedor-icono Billete"><i id="icono"className="fa-solid fa-money-bill-1"></i></div><div className="contenedor-span"><span className="label">Beneficio bruto</span><span className="numero">115</span></div></div>
              <div className="card blue-cielo"><div className="contenedor-icono Monedas"><i id="icono"className="fa-solid fa-coins"></i></div><div className="contenedor-span"><span className="label">Beneficio neto</span><span className="numero">$413</span></div></div>
            </article>
           }
           {visibleComponents.categorias &&
            <section className="cont-categorias">
              <Categoria/>
            </section>
           }
           {visibleComponents.productos &&
           <section className='cont-productos'>
            <Productos/>
           </section>
           }
           {visibleComponents.Proveedores &&
           <section className='cont-productos'>
            <Proveedores/>
           </section>
           }
           {visibleComponents.Usuarios &&
           <section className='cont-productos'>
            <Usuarios/>
           </section>
           }
           {visibleComponents.Reportes &&
            <section className='cont-productos'>
             <Reportes/>
            </section>
            }
           {visibleComponents.Mprima &&
           <section className='cont-productos'>
            <MateriasPrimas/>
           </section>
           }
          </section>
        </section>
        </div>
      </div>
    );
};
const MenuItem = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState('');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setColor(isOpen ? '' : '#ff9f00');
  };

  return (
    <li onClick={toggleMenu} style={{ color }}>
      <i className={icon}></i> {title}
      <i className={`fa-regular ${isOpen ? 'fa-square-minus' : 'fa-square-plus'}`} style={{ float: 'right' }}></i>
      {isOpen && <ul className="submenu">{children}</ul>}
    </li>
  );
};

export default HomeAdmin;