
const db = firebase.firestore(); 
const taskForm = document.getElementById('task-form'); 
const taskContainer = document.getElementById("tasks-Container");
const taskContainer2 = document.getElementById("tasks-Container2")
const taskContainer3 = document.getElementById("tasks-Container3")
const taskContainer4 = document.getElementById("tasks-Container4")


//let fs = require('fs');

const getTasks = () => db.collection("RECIBOS").get();
const getProd = () => db.collection("PRODUCTOS").get();
const  getProv = () => db.collection("PROVEEDORES").get();
let strUsuarios = "idUser,nombreUser,telUser,idPedido"+'\n';
let strPedidos = "idPedido,idUser,nombreUser,fechaPedido,direccionEntrega,totalPagado"+'\n';
let strProdPedidos = "idPedido,idUser,nombreProducto,cantidadVendida,costoProd,idProducto,idProveedor"+'\n';
let strProveedor = "idProve,nitProve,nombreProv,sector,direccion,telefono,regimen,rotacionInventario"+'\n';
let listaProd= [];
 //const onGetTasks = (callback) => db.collection("RECIBOS").onSnapshot(callback);
let i = 0;




 window.addEventListener("DOMContentLoaded", async (e) => {
    const querySnapshot = await getTasks();
    const inventario =  await getProd();
    const proveedores = await getProv();
    function clinerComas(contenido, char ) {
        let direccionClean = contenido;
        if (contenido != null ) {
            var coma ;
            var char = (typeof char !== 'undefined') ? char : ',';
            coma = contenido.indexOf(char);
            var z =0;
            if (coma == 0) {
                direccionClean = contenido.slice(1, contenido.length-1);
            }
            while (coma > -1) {
                z++;
                direccionClean = direccionClean.slice(0,coma-1) + direccionClean.slice(coma+1,direccionClean.length-1);
                //let arreglo = contenido.split('');
                console.log(z+" comas");
                coma = direccionClean.indexOf(char);
                
            }
        }else{
            direccionClean ="caja";
        }
        
        return direccionClean;
    }
    


    inventario.forEach(doc =>{
        let b =(doc.data());
        //console.log(b);
        listaProd.push(b);
    })


        querySnapshot.forEach(doc => {
            i++;
            let a =(doc.data().pedido);
            //let b = a ;
            //console.log(doc.data().pedido); 
            console.log(i);

            // usuario   
            //console.log(a.usuario.uid+','+a.usuario.nombre+','+a.usuario.telefono+','+a.id);
            let datoClean;
            strUsuarios += a.usuario.uid+',';
            datoClean = clinerComas(a.usuario.nombre);
            strUsuarios +=datoClean+','+a.usuario.telefono+','+a.id+'\n';

            // pedido
            //console.log(a.id+','+a.usuario.uid+','+a.usuario.nombre+','+ new Date(a.fechaIngreso)+','+a.direccion+','+a.total);
            
            datoClean = clinerComas(a.usuario.nombre);
            strPedidos += a.id+','+a.usuario.uid+','+datoClean+',';
            datoClean = clinerComas(a.direccion);
            strPedidos += new Date(a.fechaIngreso)+','+datoClean+','+a.total+'\n';
            

            //prodPedido
            for (let index = 0; index < a.productos.length; index++) {
                //console.log(a.id+','+a.usuario.uid+','+a.productos[index].nombre+','+a.productos[index].cantidad+','+a.productos[index].costo+','+a.productos[index].id);
                let idProd = a.productos[index].id ;
                let puesto = listaProd.findIndex( j => j.id === idProd);
                if ( puesto > -1) {
                    let prod = listaProd[puesto];
                    if (prod.esCombo == "true") {
                        console.log("es un combo de "+prod.productos.length()+" productos");
                        for (let k = 0; k < prod.productos.length; k++) {
                            const element = prod.productos[k];

                            strProdPedidos += a.id+','+a.usuario.uid+',';
                            datoClean =clinerComas(element.nombre);
                            //console.log(element.nombre+" "+datoClean);
                            if (element.proveedor != 'undefined') {
                                strProdPedidos += datoClean+','+element.cantidad+','+element.costo+','+element.id+','+element.proveedor+'\n';    
                            } else {
                                strProdPedidos += datoClean+','+element.cantidad+','+element.costo+','+element.id+','+'111'+'\n';
                            }
                        }
                    }else{
                        datoClean =clinerComas(prod.nombre);
                        //console.log(prod.nombre+" "+datoClean);
                        strProdPedidos += a.id+','+a.usuario.uid+','+datoClean+','+a.productos[index].cantidad+','+prod.costo+','+prod.id+'\n';
                    }
                }else{
                    console.log("producto no encontrado "+a.productos[index.id]+" nombre: "+a.productos[index].nombre);
                    strProdPedidos += a.id+','+a.usuario.uid+','+a.productos[index].nombre+','+a.productos[index].cantidad+','+a.productos[index].costo+','+a.productos[index].id+','+'111'+'\n';
                }
                //console.log(listaProd.findIndex( j => j.id === url));
            }
            
        });
        // proveedores
        proveedores.forEach(doc =>{
            let prov = doc.data();
            console.log(prov.nombre);
            strProveedor += prov.id+','+prov.nit+','+prov.nombre+','+prov.municipio+' '+prov.departamento+','+prov.direccion+','+prov.telefono+','+prov.regimen+','+prov.rotacionInventario+'\n';

        })


        taskContainer.innerHTML = strUsuarios;
        taskContainer2.innerHTML = strPedidos;
        taskContainer3.innerHTML = strProdPedidos;
        taskContainer4.innerHTML = strProveedor;
        /*
        fs.writeFile('Usuario.csv', strUsuarios, (err) => { 
      
            // In case of a error throw err. 
            if (err) throw err; 
        })
        fs.writeFile('Pedidos.csv', strPedidos, (err) => { 
      
            // In case of a error throw err. 
            if (err) throw err; 
        })  
        fs.writeFile('prodPedidos.csv', strProdPedidos, (err) => { 
      
            // In case of a error throw err. 
            if (err) throw err; 
        }) 
        */
 })
