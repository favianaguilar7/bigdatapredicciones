import React from "react";
import { useState, useEffect } from 'react';
import Table from './Table';
import ChartComponent from './Chart';
import TablaBody2 from './TablaBody2';
import TablaBody3 from './TablaBody3';


export default function STemp() {

      const [tableData, setTableData] = useState([]);
      const [chartLabels, setChartLabels] = useState([]);
      const [chartData, setChartData] = useState([]);
      const [PTMAC, setPTMAC] = useState([]);
      const [Perr, setPerr] = useState([]);
      const [mej, setmej] = useState([]);
    
      useEffect(() => {
        let matriz = sessionStorage.getItem('matriz');
        let pmd = sessionStorage.getItem('pmd');
        pmd = parseInt(pmd);
        let pms = sessionStorage.getItem('pms');
        pms = parseInt(pms);
        matriz = JSON.parse(matriz);
        console.log(matriz);

        // Lógica de cálculo de la matriz aquí
        let Perr = [];
        let c = matriz[0][1];
        let d = 1;
        let c1=0, c2=0, c3=0, c4=0;
        let sumerr1=0, sumerr2=0, sumerr3=0, sumerr4 = 0; 
    
        for (let i = 1; i < matriz.length; i++) {
          d++;
          c = c + matriz[i][1];
          const promedio = c / d;
          const errorAbs = matriz[i][1] - promedio;
          sumerr1+=errorAbs;
          c1++;
          matriz[i][2] = parseFloat(promedio.toFixed(2)); // PromedioSimple 
          matriz[i][3] = parseFloat(Math.abs(errorAbs).toFixed(2));// Error absoluto
        }
        Perr.push(sumerr1/c1);
    
        // Cálculo del Promedio Móvil Simple (PMS)
        let vrec = pms; // Valor de recurrencia
        console.log(vrec);
        for (let i = 0; i < matriz.length - vrec; i++) {
          let c = 0;
          for (let j = 0; j < vrec; j++) {
              c += matriz[i+j][1];
          }
          let promedio = c / vrec; 
          matriz[i+vrec][4] = parseFloat(promedio.toFixed(2));
          let errorAbs = matriz[i+vrec][1] - matriz[i+vrec][4];
          sumerr2 += errorAbs;
          c2++;
          matriz[i+vrec][5] = parseFloat(Math.abs(errorAbs).toFixed(2));
        }
        Perr.push(sumerr2 / c2);
    
        //Promedio Movil Doble
      let vrecj = pmd; //valor recibido j 
      console.log(vrecj);
      let t = matriz.length - vrec;
    
      for (let i = 0; i < t; i++) {
          let c = 0;
          if ((i + vrecj + 1) > (vrecj + vrec)) {
              for (let j = 0; j < vrecj; j++) {
                  c += matriz[i + j][4];
              }
              let Promedio = c / vrecj;
              matriz[i+vrecj][6] = parseFloat(Promedio.toFixed(2));
              let errorAbs = (matriz[i + vrecj][1] !== undefined ? matriz[i + vrecj][1] : 0) - matriz[i + vrecj][6];
              sumerr3+=errorAbs;
              c3++;
              matriz[i+vrecj][7] = parseFloat(Math.abs(errorAbs).toFixed(2));
              
          } else {
              matriz[i + vrecj][6] = 0;
              
          }
      }
          Perr.push(sumerr3/c3);
          
      //Obtener PTMAC
    
      for (let i = 0; i < matriz.length; i++) {
          // Calcular TMAC
          if (i > 0) {
              matriz[i][10] = ((matriz[i][1]) / (matriz[i - 1][1]) - 1) * 100;
          } else {
              matriz[i][10] = 0;
          }
    
          // Calcular PTMAC
          if (i > 1) {
              let ptmac = (matriz[i - 1][1]) + (matriz[i - 1][1] * (matriz[i - 1][10]) / 100);
              matriz[i][8] = parseFloat(ptmac.toFixed(2));
              let errorAbs = matriz[i][8] - matriz[i][1]
              sumerr4+=errorAbs;
              c4++;
              matriz[i][9] = parseFloat(Math.abs(errorAbs).toFixed(2));
          } else {
              matriz[i][8] = 0;
          }
      }
    
      Perr.push(sumerr4/c4);
            
      //Obtener Predicciones
      let n = matriz.length-1;
      let TMAC=[];
      let PTMAC=[];
    
      TMAC[0]=((matriz[n][1]) / (matriz[n-1][1]) - 1) * 100;
      PTMAC[0]= (matriz[n][1]) + (matriz[n][1] * (TMAC[0]) / 100);
      TMAC[1]=((PTMAC[0]) / (matriz[n][1]) - 1) * 100;
      PTMAC[1]= (PTMAC[0]) + (PTMAC[0] * (TMAC[1]) / 100);
      TMAC[2]=((PTMAC[1]) / (PTMAC[0]) - 1) * 100;
      PTMAC[2]= (PTMAC[1]) + (PTMAC[1] * (TMAC[2]) / 100);
    
      PTMAC[0]= parseFloat(PTMAC[0]).toFixed(2)
      PTMAC[1]= parseFloat(PTMAC[1]).toFixed(2)
      PTMAC[2]= parseFloat(PTMAC[2]).toFixed(2)
    
      //Obtener el mejor error
    
      let menor;
    
      if (Perr[0] < Perr[1] && Perr[0]<Perr[2] && Perr[0]<Perr[3]) {
          menor = 2;
      } else if(Perr[1] < Perr[0] && Perr[1]<Perr[2] && Perr[1]<Perr[3]) {
          menor = 4;
      } else if(Perr[2] < Perr[0] && Perr[2]<Perr[1] && Perr[2]<Perr[3]) {
          menor = 6;
      }else {
          menor = 8;
      }
    
        // Otros cálculos de la matriz aquí...
    
        // Obtener etiquetas y datos para el gráfico
        const etiquetas = matriz.map(item => item[0]);
        const datos = matriz.map(item => item[1]);
        const mej = matriz.map(item => item[menor]);
    
        // Establecer los datos calculados en los estados correspondientes
        setTableData(matriz);
        setChartLabels(etiquetas);
        setChartData(datos);
        setPTMAC(PTMAC);
        setPerr(Perr);
        setmej(mej);
      }, []);
    
      return (
        <div>

          <h1>Analisis Serie Temporal</h1>
          <Table data={tableData} />
          <h1>Promedio de errores de la Serie</h1>
          <table className='a'>
            <thead>
              <tr>
                <th className='a'>Perr 1</th>
                <th className='a'>Perr 2</th>
                <th className='a'>Perr 3</th>
                <th className='a'>Perr 4</th>
              </tr>
            </thead>
            <TablaBody3 Perr={Perr} />
          </table >
          <h1>Tabla de Predicciones Futuras</h1>
          <table className='a'>
            <thead>
              <tr>
                <th className='a'>PTMAC 1</th>
                <th className='a'>PTMAC 2</th>
                <th className='a'>PTMAC 3</th>
              </tr>
            </thead>
            <TablaBody2 PTMAC={PTMAC} />
          </table>
          <h1>Gráfico</h1>
          <ChartComponent labels={chartLabels} data={chartData} mej={mej} />
        </div>
      );
    }
    