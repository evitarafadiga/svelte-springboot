package br.com.fateczl.ProjetoLibero.persistence;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import br.com.fateczl.ProjetoLibero.model.Roadmap;

@Component
public class RoadmapDao implements IRoadmapDao{
	
	@Autowired
	GenericDao gDao;
	
	@Override
	public List<Roadmap> listaRoadmaps() throws SQLException, ClassNotFoundException {
		Connection c = gDao.getConnection();
		List<Roadmap> lista = new ArrayList<Roadmap>();
		String sql = "SELECT r.id, r.idstr, r.criadoem, r.qtdfavoritos, r.favoritado, r.qtdcompartilhamento, r.compartilhado, r.fonte, r.descricao, r.nome, r.atualizadoem FROM roadmap r;";
		PreparedStatement ps = c.prepareStatement(sql);
		ResultSet rs = ps.executeQuery();
		while (rs.next()) {
			Roadmap r = new Roadmap();
			r.setId(rs.getInt("id"));
			r.setIdStr(rs.getString("idstr"));
			r.setCriadoEm(rs.getString("criadoem"));
			r.setQtdFavoritos(rs.getInt("qtdfavoritos"));
			r.setFavoritado(rs.getBoolean("favoritado"));
			r.setQtdCompartilhamento(rs.getInt("qtdcompartilhamento"));
			r.setCompartilhado(rs.getBoolean("compartilhado"));
			r.setFonte(rs.getString("fonte"));
			r.setDescricao(rs.getString("descricao"));
			r.setNome(rs.getString("nome"));
			r.setAtualizadoEm(rs.getString("atualizadoem"));
			
			lista.add(r);
		}
		
		rs.close();
		ps.close();
		c.close();
		
		return lista;
		
	}
}
