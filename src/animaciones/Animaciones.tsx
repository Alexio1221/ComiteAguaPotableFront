// src/animaciones/Animaciones.ts
import Lottie from 'lottie-react'
import type { ComponentProps } from "react";
import gotaDeAgua from "./gotaDeAgua.json";
import aguaMarea from "./agua.json";
import aguaBlanca from "./aguaBlanca.json";
import mascotaPerro from "./mascotaPerro.json";
import liquidoCargando from "./liquidoCargando.json";
import recibo from "./recibo.json";
import correcto from "./correcto.json";
import moneda from "./moneda.json"
import perroDurmiendo from "./perroDurmiendo.json"
import perroEsperando from "./perroEsperando.json"
import calendario from "./calendario.json"
import cargando from "./cargando.json"

type LottieProps = Omit<ComponentProps<typeof Lottie>, "animationData" | "loop">;

export const AnimacionAguaBlanca = (props: LottieProps) => (
  <Lottie animationData={aguaBlanca} loop {...props} />
);

export const AnimacionGotaDeAgua = (props: LottieProps) => (
  <Lottie animationData={gotaDeAgua} loop={true} {...props} />
);

//agua en la parte inferior
export const AnimacionAgua = (props: LottieProps) => (
  <Lottie animationData={aguaMarea} loop={true} {...props} />
);

export const AnimacionMascota = (props: LottieProps) => (
  <Lottie animationData={mascotaPerro} loop={true} {...props} />
);

export const LiquidoCargando = (props: LottieProps) => (
  <Lottie animationData={liquidoCargando} loop={true} {...props} />
);

export const Recibo = (props: LottieProps) => (
  <Lottie animationData={recibo} loop={true} {...props} />
);

export const Correcto = (props: LottieProps) => (
  <Lottie animationData={correcto} loop={true} {...props} />
);

export const Moneda = (props: LottieProps) => (
  <Lottie animationData={moneda} loop={true} {...props} />
);

export const PerroDurmiendo = (props: LottieProps) => (
  <Lottie animationData={perroDurmiendo} loop={true} {...props} />
);

export const PerroEsperando = (props: LottieProps) => (
  <Lottie animationData={perroEsperando} loop={true} {...props} />
);

export const Calendario = (props: LottieProps) => (
  <Lottie animationData={calendario} loop={true} {...props} />
);

export const Cargando = (props: LottieProps) => (
  <Lottie animationData={cargando} loop={true} {...props} />
);