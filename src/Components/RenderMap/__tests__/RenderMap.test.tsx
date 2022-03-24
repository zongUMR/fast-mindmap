import * as go from 'gojs';
import { render } from '@testing-library/react';
import { NodeType } from '@/app.d';
import RenderMap from '../index';
import { inputData, mapData } from './helper';
import '../../../matchMedia.mock';

window.scrollTo = jest.fn();

describe('Test RenderMap Component for diagram', () => {
  let diagram: go.Diagram;

  // @ts-ignore
  let newData = [];

  beforeEach(() => {
    jest.useFakeTimers();
    const setData = (data: NodeType[]) => {
      newData = data;
    };

    const { container } = render(
      <RenderMap
        linkStrokeChange={{ nodeKey: null, brush: null }}
        data={inputData}
        setData={setData}
      />,
    );
    diagram = (container.getElementsByClassName('diagram-component')[0] as any)
      .goDiagram;
    diagram.commit(d => {
      d.animationManager.stopAnimation();
      d.animationManager.isEnabled = false;

      d.viewSize = new go.Size(400, 400);
    });
    // We need to insert diagram model directly here, because we can't trigger the data transform
    diagram.model = go.Model.fromJson(
      JSON.stringify({
        class: 'go.TreeModel',
        nodeDataArray: mapData,
      }),
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    newData = [];
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
  test('render data', () => {
    expect(diagram).not.toBeUndefined();
  });

  test('show 3 node and 2 line', () => {
    expect(diagram.nodes.count).toBe(3);
    expect(diagram.links.count).toBe(2);
  });
  test('node delete', () => {
    const node = diagram.findNodeForKey('2');
    diagram.select(node);
    diagram.commandHandler.deleteSelection();

    expect(diagram.nodes.count).toBe(2);
    expect(diagram.findNodeForKey('2')).toBeNull();
  });
  test('node changed', () => {
    const newText = 'text changed';
    const node = diagram.findNodeForKey('2');
    const textBlock = node?.findObject('TEXT');
    // @ts-ignore
    textBlock!.text = newText;
  });
});
