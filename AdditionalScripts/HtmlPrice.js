import {Logis, Fresh} from "./Fotter.js"
export function createHtmlFile(array, imagedata,date) {
let fresh = ``, logis = ``;
let htmlText = `<!DOCTYPE html>
<html lang="en">
<head>
<title>List</title>
<style>

@font-face {
  font-family: FormularB;
  src: url(https://fonts.gstatic.com/s/dmsans/v10/rP2Hp2ywxg089UriCZOIHQ.woff2) format('woff2');
}
@font-face {
  font-family: FormularR;
  src: url(https://fonts.gstatic.com/s/dmsans/v10/rP2Hp2ywxg089UriCZOIHQ.woff2) format('woff2');
}

body {
  font-family: FormularR;
}

table {
max-width: 1500px;
margin: 0px, auto;
margin-top: 50px;
margin-bottom: 150px;
border-collapse: collapse;
background: #ffffff;
width: 90%;
}
th {
    color: #ffffff;
    background-color: #000;
    font-size: 0.85em;
    font-family: FormularB;
    padding: 0.5em 1em;
    text-align: left;
  }
td {
font-weight: 400;
padding: 0.65em 1em;
}
.disabled td {
color: #4F5F64;
}

tbody tr:hover {
background: #535353;
color: #fff;
}

.main-container{
width: 100%;
display: flex;
flex-direction: column;
align-content: center;
align-items: center;
}


.top {
max-width: 1500px;
width: 90%;
margin: 0px, auto;
display: flex;
align-items: center;
height: 400px;
justify-content: space-between;
}

.buttom{
max-width: 1500px;
width: 90%;
display: flex;
margin-bottom: 40px;
}

.flexrow{
width: 50%;
display: flex;
flex-direction: column;
}
.flex-icons{
width: 50%;
display: flex;
flex-direction: column;
align-items: flex-end;
justify-content: flex-end;
}

.logo{
width: 30%; 
display: flex;
flex-direction: column;
background-color: #ffffff;
}
.img{
width: 50%; 
height: 90%;
display: flex; 
justify-content: center;
align-items: center;
object-fit: contain;
}
.img-resize{
max-width:100%; 
max-height:100%;
border: 1px soild black;
max-height: 300px;
}
.icon{
width: 40px;
height: 40px;
}

.icons-row{
margin-bottom: 40px;
display: flex;
justify-content: space-around;
width: 250px;
height: 40px;
}
.fttabel th{
    text-align: center;
    background-color: #000;
    color: #fff;
}

.fttabel tr:hover {
  background: #ffffff;
  color: rgb(0, 0, 0);
}

.inertable{
    text-align: left;
    color: #000;
    background-color: #fff;
}
.data{
  position:absolute;
  right:calc(5% + 20px);
  top:20px;
}

</style>
</head>
<body>
    <div class="main-container">
    <div class="top">
        <div class="data">${date}  </div>
            <div class="logo">
              <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 764.73 93.54"><polygon points="232.68 19.42 224.41 19.42 224.41 74.11 232.79 74.11 244.29 74.11 282.03 74.11 282.03 60.12 244.26 60.12 244.26 53.17 282.03 53.17 282.03 39.83 244.26 39.83 244.26 33.42 282.03 33.42 282.03 19.42 244.29 19.42 232.68 19.42"/><rect x="92.45" y="74.12" width="54.8" height="19.42"/><rect x="92.45" width="54.8" height="19.42"/><path d="M1995.72,221.87c-21.81,0-38.19,13.13-38.19,29s16.38,29,38.19,29,38.2-13.13,38.2-29S2017.53,221.87,1995.72,221.87Zm0,43.08c-10.52,0-17.47-6.08-17.47-14.11s7-14.1,17.47-14.1,17.47,6.07,17.47,14.1S2006.25,265,1995.72,265Z" transform="translate(-1269.19 -204.1)"/><polygon points="423.86 59.57 421.99 59.57 404.79 19.42 402.83 19.42 389.05 19.42 384.71 19.42 377.01 19.42 369.38 19.42 369.38 74.11 389.02 74.11 389.02 33.97 390.94 33.97 408.15 74.11 411.84 74.11 423.88 74.11 428.23 74.11 437.56 74.11 443.5 74.11 443.5 19.42 423.86 19.42 423.86 59.57"/><path d="M1450.55,223.52h-34.1v54.7h34.1c21.59,0,36.78-11.29,36.78-27.35S1472.14,223.52,1450.55,223.52Zm0,40.16H1436.3V238.07h14.25c9.66,0,16.06,5.42,16.06,12.8S1460.21,263.68,1450.55,263.68Z" transform="translate(-1269.19 -204.1)"/><path d="M1926.71,223.52H1887.4v54.7h19.85V262.16h19.46c15.52,0,26.48-7.71,26.48-19.32S1942.23,223.52,1926.71,223.52Zm0,24.2h-19.46V238h19.46c4,0,6.07,2.49,6.07,4.88S1930.72,247.72,1926.71,247.72Z" transform="translate(-1269.19 -204.1)"/><path d="M1630.46,242.5c0-11.61-11-19-26.47-19H1562.4v54.7h19.85V261.29h15l11.63,16.93H1631l-13.36-19C1625.55,256.16,1630.46,250.27,1630.46,242.5ZM1582.25,238H1604c4,0,6.07,2.17,6.07,4.55s-2.06,4.56-6.07,4.56h-21.74Z" transform="translate(-1269.19 -204.1)"/><polygon points="482.05 19.42 473.77 19.42 473.77 74.11 482.16 74.11 493.66 74.11 531.39 74.11 531.39 60.12 493.63 60.12 493.63 53.17 531.39 53.17 531.39 39.83 493.63 39.83 493.63 33.42 531.39 33.42 531.39 19.42 493.66 19.42 482.05 19.42"/><polygon points="75.34 19.42 72.63 19.42 58.63 19.42 57 19.42 45.88 57.05 34.75 19.42 31.93 19.42 19.13 19.42 16.41 19.42 6.11 19.42 0 19.42 0 74.11 19.1 74.11 19.1 33.97 20.71 33.97 32.58 74.11 40.83 74.11 50.92 74.11 59.17 74.11 71.04 33.97 72.6 33.97 72.6 74.11 92.45 74.11 92.45 19.42 84.45 19.42 75.34 19.42"/><polygon points="590.45 19.42 575.15 35.92 559.85 19.42 536.31 19.42 562.24 46.44 536.31 74.11 559.85 74.11 575.15 57.3 590.45 74.11 613.89 74.11 588.07 46.44 613.89 19.42 590.45 19.42"/></svg>
              <p>
              Modern Expo is a top company in<br>
              the creation of modern retail<br>
              ecosystems for more than<br>
              20 years. Nowadays, one of the<br>
              leading directions of our work are<br>
              developing products and services<br>
              for the last mile, with a focus on<br>
              parcel terminals solutions.<br>
              We believe that delivery is<br>
              an invisible powerful force that<br>
              brings things together              </p>
            </div>
            <div class="img">   
              <div id='forimage'>
              </div>
            </div>
    </div>
        <table>
                <thead>
                <tr>
                    <th>Сode
                    <th>Item Name
                    <th>Q-ty
                    <th>Price &#8364
                    <th>Total &#8364
                </thead>
                <tbody>`;
    array.forEach(row => {
      if(row[1]=='') {
        htmlText+=`<tr style="background-color:#caefff">`;
      }
      else {
        htmlText+="<tr>";
      }
        row.forEach(column => { 
          if(row[0]=='_') {
            htmlText+="<tr style='heigth: 10px;'><th><th><th><th><th>";
          }
          else {
            if (typeof(column)== "string"){
              if(column.includes("LOKOLOGIS")){
                logis = Logis;
                
              }
              if(column.includes("LOKOFRESH")){
                fresh = Fresh;
              }
              }
              htmlText+="<td>"+column+"</td>";     
          }
        });
        htmlText+="</tr>";
    });
    htmlText+=`
        </tbody>
            </table>
            ${logis}
            ${fresh}
            <div class="buttom">
            <div class="flexrow" style="font-family: DM Sans,sans-serif;">
            Contact Us:
            <p style="font-size: 20px;">
            <!--<span style=" font-weight: bolder;">Tkachenko Vitalii <br>
            Logistics Solutions Department<br></span>-->
            Tel.: +38 (0332) 789-500<br>
            <!--Mob.: +380 (50) 464 39 39-->
            </p>
            <p style="font-size: 20px;">
            E-mail: info@modern-expo.com<br>
            https://modern-expo.eu/
            
            </p>
            </div>
            <div class="flex-icons">
                <div class="icons-row">
                    <a class="icon" target="_blank" rel="noopener noreferrer" href="https://modern-expo.eu/"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43.7 43.7"><circle cx="21.85" cy="21.85" r="21.85"/><circle cx="21.85" cy="21.85" r="12.49" style="stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.246899962425232px"/><ellipse cx="21.85" cy="21.85" rx="4.63" ry="12.49" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.246899962425232px"/><path d="M21.85,15.44a20.23,20.23,0,0,1-9.18-2,12.29,12.29,0,0,0-3.24,8.39,12.62,12.62,0,0,0,3.24,8.39,20.23,20.23,0,0,1,9.18-2,20.25,20.25,0,0,1,9.19,2,12.29,12.29,0,0,0,3.24-8.39A12.62,12.62,0,0,0,31,13.46,19.74,19.74,0,0,1,21.85,15.44Z" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.246899962425232px"/></svg></a>
                    <a class="icon" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/ModernExpo"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M24,0A24,24,0,1,0,48,24,24,24,0,0,0,24,0Zm2.5,25.05V38.11H21.1V25.05H18.4V20.56h2.7V17.85C21.1,14.18,22.62,12,27,12h3.61v4.5H28.3c-1.68,0-1.79.63-1.79,1.8v2.25h4.08l-.47,4.5Z" style="fill-rule:evenodd"/></svg></a>
                    <a class="icon" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/company/modernexpo"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M24,0A24,24,0,1,0,48,24,24,24,0,0,0,24,0ZM11.52,19.88H17V36.22H11.52Zm5.8-5.06a2.83,2.83,0,0,0-3-2.82,2.83,2.83,0,1,0-.07,5.65h0A2.84,2.84,0,0,0,17.32,14.82Zm13,4.67c3.58,0,6.27,2.34,6.27,7.36v9.37H31.14V27.48c0-2.2-.79-3.7-2.76-3.7a3,3,0,0,0-2.79,2,3.77,3.77,0,0,0-.18,1.32v9.13H20S20,21.41,20,19.88h5.44v2.31A5.41,5.41,0,0,1,30.31,19.49Z" style="fill-rule:evenodd"/></svg></a>
                    <a class="icon" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/modern_expo/"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M24,0A24,24,0,1,0,48,24,24,24,0,0,0,24,0ZM18.72,11.28c1.37-.06,1.8-.08,5.28-.08h0c3.47,0,3.91,0,5.27.08a9.47,9.47,0,0,1,3.11.59,6.57,6.57,0,0,1,3.75,3.75,9.46,9.46,0,0,1,.59,3.1c.06,1.37.08,1.8.08,5.28s0,3.91-.08,5.28a9.46,9.46,0,0,1-.59,3.1,6.57,6.57,0,0,1-3.75,3.75,9.46,9.46,0,0,1-3.1.59c-1.37.07-1.8.08-5.28.08s-3.91,0-5.28-.08a9.59,9.59,0,0,1-3.11-.59,6.59,6.59,0,0,1-3.74-3.75,9.46,9.46,0,0,1-.59-3.1c-.06-1.37-.08-1.8-.08-5.28s0-3.91.08-5.28a9.21,9.21,0,0,1,.59-3.1,6.57,6.57,0,0,1,3.75-3.75A9.46,9.46,0,0,1,18.72,11.28Z" style="fill-rule:evenodd"/><path d="M22.85,13.51H24c3.42,0,3.82,0,5.17.07a7.32,7.32,0,0,1,2.38.44A4.27,4.27,0,0,1,34,16.45a7.32,7.32,0,0,1,.44,2.38c.06,1.35.07,1.75.07,5.17s0,3.82-.07,5.17A7.24,7.24,0,0,1,34,31.54,3.83,3.83,0,0,1,33,33a3.91,3.91,0,0,1-1.47,1,6.8,6.8,0,0,1-2.38.44c-1.35.06-1.75.08-5.17.08s-3.82,0-5.17-.08A6.8,6.8,0,0,1,16.45,34,3.91,3.91,0,0,1,15,33a3.83,3.83,0,0,1-1-1.47,7.3,7.3,0,0,1-.44-2.37c-.06-1.35-.07-1.76-.07-5.18s0-3.82.07-5.17A7.3,7.3,0,0,1,14,16.45,4,4,0,0,1,15,15a4,4,0,0,1,1.47-1,6.8,6.8,0,0,1,2.38-.44c1.18-.06,1.64-.07,4-.08Zm8,2.12a1.54,1.54,0,1,0,1.54,1.54,1.54,1.54,0,0,0-1.54-1.54ZM17.43,24A6.57,6.57,0,1,1,24,30.57,6.57,6.57,0,0,1,17.43,24Z" style="fill-rule:evenodd"/><path d="M24,19.73A4.27,4.27,0,1,1,19.73,24,4.27,4.27,0,0,1,24,19.73Z"/></svg></a>
                    <a class="icon" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/c/ModernExpoGroup"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M24,0A24,24,0,1,0,48,24,24,24,0,0,0,24,0ZM34,15.75a3.23,3.23,0,0,1,2.26,2.32,34.81,34.81,0,0,1,.54,6.33,34.81,34.81,0,0,1-.54,6.33A3.23,3.23,0,0,1,34,33.05c-2,.55-10,.55-10,.55s-8,0-10-.55a3.26,3.26,0,0,1-2.27-2.32,35.45,35.45,0,0,1-.53-6.33,35.45,35.45,0,0,1,.53-6.33A3.26,3.26,0,0,1,14,15.75c2-.55,10-.55,10-.55S32,15.2,34,15.75Z" style="fill-rule:evenodd"/><path d="M21.6,28.8v-8l6.4,4Z"/></svg></a>
                </div>
               
            </div>
        </div>
        
            </div> 
            
        </body>
        <script>
            var img = new Image();
            img.className = "img-resize";
            img.src = '${imagedata}';
            document.getElementById('forimage').appendChild(img);
        </script>
    </html>`
    return htmlText;
}




export function createHtmlFileLite(array) {
  let htmlText = `<!DOCTYPE html>
  <html lang="en">
  <head>
  <title>List</title>
  <style>
  
  @font-face {
    font-family: FormularB;
    src: url(https://fonts.gstatic.com/s/dmsans/v10/rP2Hp2ywxg089UriCZOIHQ.woff2) format('woff2');
  }
  @font-face {
    font-family: FormularR;
    src: url(https://fonts.gstatic.com/s/dmsans/v10/rP2Hp2ywxg089UriCZOIHQ.woff2) format('woff2');
  }
  
  body {
    font-family: FormularR;
  }
  
  table {
  max-width: 1500px;
  margin: 0px, auto;
  margin-top: 50px;
  margin-bottom: 150px;
  border-collapse: collapse;
  background: #ffffff;
  width: 90%;
  }
  th {
      color: #ffffff;
      background-color: #000;
      font-size: 0.85em;
      font-family: FormularB;
      padding: 0.5em 1em;
      text-align: left;
    }
  td {
  font-weight: 400;
  padding: 0.65em 1em;
  }
  
  tbody tr:hover {
  background: #535353;
  color: #fff;
  }
  
  
  </style>
  </head>
  <body>
          <table>
                  <thead>
                  <tr>
                      <th>Vendor code
                      <th>Item Name
                      <th>Amount
                      <th>Price
                      <th>Total
                  </thead>
                  <tbody>`;
      array.forEach(row => {
          htmlText+="<tr>";
          
          row.forEach(column => { 
            if(row[0]=='_') {
              htmlText+="<tr style='heigth: 10px;'><th><th><th><th><th>";
            }
            else {
                htmlText+="<td>"+column+"</td>";     
            }
          });
          htmlText+="</tr>";
      });
      htmlText+=`
          </tbody>
              </table>
          </body>
      </html>`
      return htmlText;
  }