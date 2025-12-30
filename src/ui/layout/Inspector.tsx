function Inspector() {
  return (
    <section className="card" aria-labelledby="inspector-title">
      <h2 id="inspector-title">Inspector</h2>
      <p>View and adjust selected element properties.</p>
      <ul>
        <li>Dimensions: mm</li>
        <li>Position: mm</li>
        <li>Rotation: degrees</li>
      </ul>
    </section>
  );
}

export default Inspector;
