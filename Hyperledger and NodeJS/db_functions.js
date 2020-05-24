const mariadb = require('mariadb');

const pool = mariadb.createPool({
     host: 'localhost', 
     user:'ec544_user', 
     password: 'CloudComputing!1',
     database: 'ec544',
     connectionLimit: 5
});

const queryMap = new Map();
queryMap.set('patients', 'SELECT * from patient');
// queryMap.set('meds', 'SELECT * from medication m left outer join Med_Schedule s on m.Id = s.Med_Id where m.PatientId = ? and s.DoseTime = (Select min(DoseTime) from Med_Schedule where Med_Id = s.Med_Id)');
// queryMap.set('meds', 'SELECT * from medication m left outer join Med_Schedule s on m.Id = s.Med_Id where m.PatientId = ?');
queryMap.set('medsched', 'select Name, DoseTime from Med_Schedule s left outer join medication m on s.Med_Id = m.Id');
queryMap.set('medrestrictions', 'select r.Restriction from Med_Restriction m left outer join restriction r on m.RestrictionId = r.Id where m.MedId = ?');
queryMap.set('meds', 'SELECT m.Id, m.Name, m.Indication, m.Dosage, m.Quantity, s.DoseTime, r.Restriction \
from medication m \
	left outer join Med_Schedule s on m.Id = s.Med_Id \
	left outer join Med_Restriction mr on m.Id = mr.MedId \
	Left outer join restriction r on mr.RestrictionId = r.Id \
where m.PatientId = ? and s.DoseTime = (Select min(DoseTime) from Med_Schedule where Med_Id = s.Med_Id)');

async function db_getData(mapKey, pId) {
  let conn;
  let rows;
  try {
	conn = await pool.getConnection();
	if (pId) {
		rows = await conn.query(queryMap.get(mapKey), pId);
	} else {
		rows = await conn.query(queryMap.get(mapKey));
	}
	return JSON.stringify(rows);
  } catch (err) {
	throw err;
  } finally {
	if (conn) conn.end();
  }
  
}

module.exports = {
	db_getData
};