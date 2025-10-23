// src/animaciones/Animaciones.ts
import Lottie from "lottie-react";
import gotaDeAgua from "./gotaDeAgua.json";
import aguaMarea from "./agua.json";
import aguaBlanca from "./aguaBlanca.json";
import mascotaPerro from "./mascotaPerro.json";

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