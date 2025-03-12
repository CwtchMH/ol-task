import '@testing-library/jest-dom';

// Mock for canvas used by OpenLayers
HTMLCanvasElement.prototype.getContext = jest.fn() as any;
