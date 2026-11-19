function StatCard({ valeur, libelle }) {
  return (
    <div className="stat-card">
      <p className="valeur">{valeur}</p>
      <p className="libelle">{libelle}</p>
    </div>
  );
}

export default StatCard;