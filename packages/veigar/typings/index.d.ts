declare function getApp(): any;
declare function getCurrentPages(): Array<{
  setData: (...args: any) => void;
  __route__: string;
  [key: string]: any;
}>;
declare const App;
