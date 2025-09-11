import "datatables.net";

declare module "datatables.net" {
  interface Config {
    fixedHeader?: boolean | {
      header?: boolean;
      footer?: boolean;
    };
  }
}