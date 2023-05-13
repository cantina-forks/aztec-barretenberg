import { BarretenbergBinderSync } from '../barretenberg_binder/index.js';
import { BarretenbergWasm } from '../barretenberg_wasm/barretenberg_wasm.js';
import { Fr } from '../types/index.js';
import { BarretenbergApiSync } from './index.js';

describe('pedersen', () => {
  let api: BarretenbergApiSync;

  beforeAll(async () => {
    api = new BarretenbergApiSync(new BarretenbergBinderSync(await BarretenbergWasm.new(1)));
    api.pedersenHashInit();
  });

  afterAll(async () => {
    await api.destroy();
  });

  it('pedersenCompressFields', () => {
    const result = api.pedersenCompressFields(new Fr(4n), new Fr(8n));
    expect(result).toEqual(new Fr(16672613430297770667465722499387909817686322516130512258122141976728892914370n));
  });

  it('pedersenPlookupCompressFields', () => {
    const result = api.pedersenPlookupCompressFields(new Fr(4n), new Fr(8n));
    expect(result).toEqual(new Fr(7508407170365331152493586290597472346478280823936748458450026785528968221772n));
  });

  it('pedersenCompress', () => {
    const result = api.pedersenCompress([new Fr(4n), new Fr(8n), new Fr(12n)]);
    expect(result).toEqual(new Fr(20749503715308760529311051818180468653739005441229560405092292242074298877245n));
  });

  it('pedersenPlookupCompress', () => {
    const result = api.pedersenPlookupCompress([new Fr(4n), new Fr(8n), new Fr(12n)]);
    expect(result).toEqual(new Fr(641613987782189905475142047603559162464012327378197326488471789040703504911n));
  });

  it('pedersenCompressWithHashIndex', () => {
    const result = api.pedersenCompressWithHashIndex([new Fr(4n), new Fr(8n)], 7);
    expect(result).toEqual(new Fr(12675961871866002745031098923411501942277744385859978302365013982702509949754n));
  });

  it('pedersenCommit', () => {
    const result = api.pedersenCommit([new Fr(4n), new Fr(8n), new Fr(12n)]);
    expect(result).toEqual(new Fr(20749503715308760529311051818180468653739005441229560405092292242074298877245n));
  });

  it('pedersenPlookupCommit', () => {
    const result = api.pedersenPlookupCommit([new Fr(4n), new Fr(8n)]);
    expect(result).toEqual(new Fr(7508407170365331152493586290597472346478280823936748458450026785528968221772n));
  });

  it('pedersenBufferToField', () => {
    const result = api.pedersenBufferToField(Buffer.from('Hello world! I am a buffer to be converted to a field!'));
    expect(result).toEqual(new Fr(4923399520610513632896240312051201308554838580477778325691012985962614653619n));
  });

  it('pedersenHashPair', () => {
    const result = api.pedersenHashPair(new Fr(4n), new Fr(8n));
    expect(result).toEqual(new Fr(7508407170365331152493586290597472346478280823936748458450026785528968221772n));
  });

  it('pedersenHashMultiple', () => {
    const result = api.pedersenHashMultiple([new Fr(4n), new Fr(8n), new Fr(12n)]);
    expect(result).toEqual(new Fr(641613987782189905475142047603559162464012327378197326488471789040703504911n));
  });

  it('pedersenHashMultipleWithHashIndex', () => {
    const result = api.pedersenHashMultipleWithHashIndex([new Fr(4n), new Fr(8n)], 7);
    expect(result).toEqual(new Fr(14181105996307540196932058280391669339364159586581375348016341320932872505408n));
  });

  it('pedersenHashToTree', () => {
    const result = api.pedersenHashToTree([new Fr(4n), new Fr(8n), new Fr(12n), new Fr(16n)]);
    expect(result).toEqual([
      new Fr(4n),
      new Fr(8n),
      new Fr(12n),
      new Fr(16n),
      new Fr(7508407170365331152493586290597472346478280823936748458450026785528968221772n),
      new Fr(61370238324203854110612958249832030753990119715269709182131929073387209477n),
      new Fr(7696240979753031171651958947943309270095593128155855154123615677953596407768n),
    ]);
  });
});
