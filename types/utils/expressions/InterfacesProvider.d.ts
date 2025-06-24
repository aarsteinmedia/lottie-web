declare const interfaces: {
    comp: any;
    effects: any;
    footage: any;
    layer: any;
    shape: any;
    text: any;
};
declare function getInterface(type: keyof typeof interfaces): any;
export default getInterface;
