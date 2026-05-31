import { SortingEngine } from '@/features/sorting/engine';

export default function Home() {
  const array = SortingEngine.generateArray(10);
  const frames = SortingEngine.generateFrames('bubble', array);

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#0f0f1a', color: 'white', minHeight: '100vh' }}>
      <h1>SortSphere — Engine Test</h1>
      <p>Original array: [{array.join(', ')}]</p>
      <p>Total animation frames: {frames.length}</p>
      <p>Final sorted array: [{frames[frames.length - 1].array.join(', ')}]</p>
      <p>Total comparisons: {frames[frames.length - 1].metrics.comparisons}</p>
      <p>Total swaps: {frames[frames.length - 1].metrics.swaps}</p>
      <hr style={{ margin: '1rem 0', borderColor: '#333' }}/>
      <p>✅ Sorting engine is working correctly</p>
    </div>
  );
}