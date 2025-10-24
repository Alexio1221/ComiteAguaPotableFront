// src/animaciones/Animaciones.ts
import Lottie from "lottie-react";
import gotaDeAgua from "./gotaDeAgua.json";
import aguaMarea from "./agua.json";
import aguaBlanca from "./aguaBlanca.json";
import mascotaPerro from "./mascotaPerro.json";
import liquidoCargando from "./liquidoCargando.json";
import recibo from "./recibo.json";
import correcto from "./correcto.json";
import moneda from "./moneda.json"

export const AnimacionAguaBlanca = (props: any) => (
  <Lottie animationData={aguaBlanca} loop={true} {...props} />
);

export const AnimacionGotaDeAgua = (props: any) => (
  <Lottie animationData={gotaDeAgua} loop={true} {...props} />
);

//agua en la parte inferior
export const AnimacionAgua = (props: any) => (
  <Lottie animationData={aguaMarea} loop={true} {...props} />
);

export const AnimacionMascota = (props: any) => (
  <Lottie animationData={mascotaPerro} loop={true} {...props} />
);

export const LiquidoCargando = (props: any) => (
  <Lottie animationData={liquidoCargando} loop={true} {...props} />
);

export const Recibo = (props: any) => (
  <Lottie animationData={recibo} loop={true} {...props} />
);

export const Correcto = (props: any) => (
  <Lottie animationData={correcto} loop={true} {...props} />
);

export const Moneda = (props: any) => (
  <Lottie animationData={moneda} loop={true} {...props} />
);