import * as moltin from '@moltin/sdk';

declare module '@moltin/sdk' {

  interface Weight {
    g: number;
    kg: number;
    lb: number;
    oz: number;
  }

  interface ProductBase {
    background_color: string;
    background_colour: string | null;
    bulb: string;
    bulb_qty: string;
    finish: string;
    material: string;
    max_watt: string;
    new: string | null;
    on_sale: string | null;
    weight: Weight;
  }

}
