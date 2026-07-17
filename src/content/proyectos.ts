export type Proyecto = {
  id: string;
  nombre: string;
  descripcion: string;
  estado: 'live' | 'en construcción' | 'privado';
  url?: string;
  nacioEnPulso?: boolean; // true SOLO Exchange → pill "nació en pulso" + filete turquesa
  esPulsoDeX?: string; // nombre de la persona → lockup "PULSO · de X" (mini-app sin marca propia)
  detalles?: string[]; // chips de detalle — solo trabajos terminados (prisma más detallado)
  retazo?: 'mostaza' | 'verde'; // color de la muestra de tela — solo trabajos en proceso
  tinte?: 'ocre'; // tinte de tela para terminados — reparte la paleta sin volverlos retazo
};

export const proyectos: Proyecto[] = [
  {
    id: 'pulso-exchange',
    nombre: 'pulso exchange',
    descripcion:
      'Armé un exchange cripto de demostración, sin plata real: mercado en vivo, trading, staking on-chain y bots, todo sobre Sepolia testnet. Vos manejás tu seed, yo nunca te la pido. Los contratos están verificados en Etherscan. El paso a Google Play se está armando: el paquete ya está firmado y la ficha lista.',
    estado: 'live',
    url: 'https://pulso-exchange.vercel.app',
    nacioEnPulso: true,
    detalles: ['contratos verificados', 'web en vivo', 'paquete de play firmado'],
  },
  {
    id: 'pulso-de-sol',
    nombre: 'pulso de sol',
    descripcion:
      'Armé un sistema privado que labura todos los días para una clienta real: le acerca inteligencia de su mercado, solito. Es de ella y vive puertas adentro de su negocio.',
    estado: 'privado',
    esPulsoDeX: 'de Sol',
    retazo: 'verde',
  },
  {
    id: 'aa-smart-wallet',
    nombre: 'aa smart wallet',
    descripcion:
      'Armé una wallet con account abstraction (ERC-4337): ejecutás transacciones on-chain sin tener ETH para el gas — lo paga un paymaster. Contratos verificados en Sepolia, dApp funcionando en vivo.',
    estado: 'live',
    url: 'https://aa-smart-wallet.vercel.app',
    detalles: ['erc-4337', 'gasless', 'verificado en sepolia'],
    tinte: 'ocre',
  },
  {
    id: 'ulises-deco',
    nombre: 'ulises deco',
    descripcion:
      'Armé una tienda online de decoración argentina: catálogo, carrito, MercadoPago y pago con cripto. Está saliendo del horno.',
    estado: 'en construcción',
    retazo: 'mostaza',
  },
];
