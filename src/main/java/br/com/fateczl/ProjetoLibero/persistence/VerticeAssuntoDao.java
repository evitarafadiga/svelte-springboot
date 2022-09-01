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

import br.com.fateczl.ProjetoLibero.model.Vertice;

@Component
public class VerticeAssuntoDao implements IVerticeAssuntoDao {
	
	@Autowired
	GenericDao gDao;
	
	private Connection c;
	
	public String insertVerticeAssunto(Vertice v) throws SQLException {
		String saida = insUpdDel(v,"I");
		return saida;
		
	}
	public String updateVerticeAssunto(Vertice v) throws SQLException {
		String saida = insUpdDel(v,"U");
		return saida;
	}

	public String deleteVerticeAssunto(Vertice v) throws SQLException {
		String saida = insUpdDel(v,"D");
		return saida;
	}
	
	public String insUpdDel(Vertice v, String cod) throws SQLException {
		String sql = "{CALL sp_iud_verticeassunto (?,?,?,?,?,?)}";
		CallableStatement cs = c.prepareCall(sql);
		cs.setString(1, cod);
		cs.setInt(2, v.getId());
		cs.setInt(3, v.getFromId());
		cs.setInt(4, v.getToId());
		cs.setInt(5, v.getPeso());
		cs.registerOutParameter(6, Types.VARCHAR);
		
		cs.execute();
		String saida = cs.getString(6);
		cs.close();
		c.close();
		return saida;
	}
	
	@Override
	public List<Vertice> listaVerticeAssunto() throws SQLException, ClassNotFoundException {
		Connection c = gDao.getConnection();
		List<Vertice> lista = new ArrayList<Vertice>();
		String sql = "SELECT v.id, v.from_id, v.to_id, v.peso FROM verticeassunto v";
		PreparedStatement ps = c.prepareStatement(sql);
		ResultSet rs = ps.executeQuery();
		while (rs.next()) {
			Vertice v = new Vertice();
			v.setId(rs.getInt("id"));
			v.setFromId(rs.getInt("from_id"));
			v.setToId(rs.getInt("to_id"));
			v.setPeso(rs.getInt("peso"));
			
			lista.add(v);
		}
		
		rs.close();
		ps.close();
		c.close();
		
		return lista;
		
	}
}
