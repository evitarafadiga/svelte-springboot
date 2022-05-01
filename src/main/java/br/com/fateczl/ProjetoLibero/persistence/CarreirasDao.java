package br.com.fateczl.ProjetoLibero.persistence;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.fateczl.ProjetoLibero.model.Carreiras;

@Component
public class CarreirasDao implements ICarreirasDao {
	
	@Autowired
	GenericDao gDao;
	
	private Connection c;
	
	@Override
	public String insertCarreiras(Carreiras car) throws SQLException {
		String saida = insUpdDel(car,"I");
		return saida;
	}

	@Override
	public String updateCarreiras(Carreiras car) throws SQLException {
		String saida = insUpdDel(car,"U");
		return saida;
	}

	@Override
	public String deleteCarreiras(Carreiras car) throws SQLException {
		String saida = insUpdDel(car,"D");
		return saida;
	}
	
	public String insUpdDel(Carreiras car, String cod) throws SQLException {
		String sql = "{CALL sp_iud_carreiras (?,?,?,?)}";
		CallableStatement cs = c.prepareCall(sql);
		cs.setString(1, cod);
		cs.setInt(2, car.getId_car());
		cs.setString(3, car.getNome());
		cs.registerOutParameter(4, Types.VARCHAR);
		
		cs.execute();
		String saida = cs.getString(4);
		cs.close();
		c.close();
		return saida;
	}
	
	@Override
	public List<Carreiras> listaCarreiras() throws SQLException, ClassNotFoundException {
		Connection c = gDao.getConnection();
		List<Carreiras> lista = new ArrayList<Carreiras>();
		String sql = "SELECT c.id_car, c.nome FROM carreiras c";
		PreparedStatement ps = c.prepareStatement(sql);
		ResultSet rs = ps.executeQuery();
		while (rs.next()) {
			Carreiras car = new Carreiras();
			car.setId_car(rs.getInt("id_car"));
			car.setNome(rs.getString("nome"));
			
			lista.add(car);
		}
		
		rs.close();
		ps.close();
		c.close();
		
		return lista;
		
	}
	
	
}
