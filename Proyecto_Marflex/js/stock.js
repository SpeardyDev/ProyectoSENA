const btncentroInventario = document.getElementById('btn-centro-inventario');
const contenedorStockCentroInventario = document.getElementById('centro-inventario');

btncentroInventario.addEventListener('click',()=>{
    contenedorStockCentroInventario.style.display='flex';
    genaralStock.style.display = 'none';
})
//////////////////////////////////// Mostrar Genearl stock ////////////////////////////////////////////////
const btnGenaral = document.getElementById('btn-general');
const genaralStock = document.getElementById('genaral-stock');

btnGenaral.addEventListener('click', ()=>{
    genaralStock.style.display = 'flex';
    contenedorStockCentroInventario.style.display='none';
});
///////////////////////////////////// Mostrar formulario de ajuste Stock //////////////////////////////////
const btnAjusteStock = document.getElementById('btn-ajuste');
const formAjustarStock = document.getElementById('contenido-formulario-ajusteStock');
const btnCerrarajuste = document.getElementById('btn-cerrar-formStock');

btnAjusteStock.addEventListener('click', ()=>{
    formAjustarStock.style.display = 'flex';
});

btnCerrarajuste.addEventListener('click', ()=> {
    formAjustarStock.style.display = 'none';
})