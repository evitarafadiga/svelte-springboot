package br.com.fateczl.ProjetoLibero.persistence;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.fateczl.ProjetoLibero.model.Assunto;
@Component
public class AssuntoDao implements IAssuntoDao { 
	
	@Autowired
	GenericDao gDao;
	
	@Override
	public List<Assunto> listaAssuntos() throws SQLException, ClassNotFoundException {
		Connection c = gDao.getConnection();
		List<Assunto> lista = new ArrayList<Assunto>();
		String sql = "SELECT a.id, a.idstr, a.criadoem, a.qtdfavoritos, a.favoritado, a.qtdcompartilhamento, a.compartilhado, a.fonte, a.descricao, a.estudado, a.atualizadoem FROM assunto a";
		PreparedStatement ps = c.prepareStatement(sql);
		ResultSet rs = ps.executeQuery();
		while (rs.next()) {
			Assunto a = new Assunto();
			a.setId(rs.getInt("id"));
			a.setIdStr(rs.getString("idstr"));
			a.setCriadoEm(rs.getString("criadoem"));
			a.setQtdFavoritos(rs.getInt("qtdfavoritos"));
			a.setFavoritado(rs.getBoolean("favoritado"));
			a.setQtdCompartilhamento(rs.getInt("qtdcompartilhamento"));
			a.setCompartilhado(rs.getBoolean("compartilhado"));
			a.setFonte(rs.getString("fonte"));
			a.setDescricao(rs.getString("descricao"));
			a.setEstudado(rs.getBoolean("estudado"));
			a.setAtualizadoEm(rs.getString("atualizadoem"));
			
			lista.add(a);
		}
		
		rs.close();
		ps.close();
		c.close();
		
		return lista;
	}
}