package br.com.fateczl.ProjetoLibero.persistence;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import br.com.fateczl.ProjetoLibero.model.Assunto;
import br.com.fateczl.ProjetoLibero.model.Roadmap;

@Component
public class RoadmapDao implements IRoadmapDao{
	
	@Autowired
	GenericDao gDao;
	
	private Connection c;
	
	@Override
	public String insertRoadmap(Roadmap r) throws SQLException {
		String saida = insUpdDel(r, "I");
		return saida;
	}
	
	@Override
	public String updateRoadmap(Roadmap r) throws SQLException {
		String saida = insUpdDel(r, "U");
		return saida;
	}
	
	@Override
	public String deleteRoadmap(Roadmap r) throws SQLException {
		String saida = insUpdDel(r, "D");
		return saida;
	}
	
	public String insUpdDel(Roadmap r, String cod) throws SQLException {
		String sql = "{CALL sp_iud_roadmap (?,?,?,?,?,?,?,?,?,?,?,?)}";
		CallableStatement cs = c.prepareCall(sql);
		cs.setString(1, cod);
		cs.setInt(2, r.getId());
		cs.setString(3, r.getCriadoEm());
		cs.setInt(4, r.getQtdFavoritos());
		//cs.setBoolean(5, r.getFavoritado());
		cs.setInt(6, r.getQtdCompartilhamento());
		//cs.setBoolean(7, r.getCompartilhado());
		cs.setString(8, r.getFonte());
		cs.setString(9, r.getDescricao());
		cs.setString(10, r.getNome());
		cs.setString(11, r.getAtualizadoEm());
		cs.registerOutParameter(12, Types.VARCHAR);
		
		cs.execute();
		String saida = cs.getString(12);
		cs.close();
		c.close();
		return saida;
	}
	
	@Override
	public List<Roadmap> listaRoadmaps() throws SQLException, ClassNotFoundException {
		Connection c = gDao.getConnection();
		List<Roadmap> lista = new ArrayList<Roadmap>();
		String sql = "SELECT r.id_roa, r.criadoem, r.qtdfavoritos, r.qtdcompartilhamento, r.fonte, r.descricao, r.nome, r.atualizadoem FROM roadmap r";
		PreparedStatement ps = c.prepareStatement(sql);
		ResultSet rs = ps.executeQuery();
		while (rs.next()) {
			Roadmap r = new Roadmap.Builder(rs.getInt("id_roa"))
					.criadoEm(rs.getString("criadoem"))
					.qtdFavoritos(rs.getInt("qtdfavoritos"))
					.qtdCompartilhamento(rs.getInt("qtdcompartilhamento"))
					.fonte(rs.getString("fonte"))
					.descricao(rs.getString("descricao"))
					.atualizadoEm(rs.getString("atualizadoem"))
					.nome(rs.getString("nome"))
					.build();
			
			
			lista.add(r);
		}
		
		rs.close();
		ps.close();
		c.close();
		
		return lista;
		
	}
}
