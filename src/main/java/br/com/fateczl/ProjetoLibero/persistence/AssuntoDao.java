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

import br.com.fateczl.ProjetoLibero.model.Assunto;
@Component
public class AssuntoDao implements IAssuntoDao { 
	
	@Autowired
	GenericDao gDao;
	
	private Connection c;
	
	@Override
	public String insertAssunto(Assunto a) throws SQLException {
		String saida = insUpdDel(a,"I");
		return saida;
	}

	@Override
	public String updateAssunto(Assunto a) throws SQLException {
		String saida = insUpdDel(a,"U");
		return saida;
	}

	@Override
	public String deleteAssunto(Assunto a) throws SQLException {
		String saida = insUpdDel(a,"D");
		return saida;
	}
	
	@Override
	public Assunto insereAssunto(Assunto a) throws SQLException, ClassNotFoundException {
		Connection c = gDao.getConnection();
		String sql = "INSERT INTO assunto VALUES (?,?,?,?,?,?) ";
		PreparedStatement ps = c.prepareStatement(sql);
		ps.setString(1, a.getCriadoEm());
		ps.setInt(2, a.getQtdFavoritos());
		ps.setInt(3, a.getQtdCompartilhamento());
		ps.setString(4, a.getFonte());
		ps.setString(5, a.getDescricao());
		ps.setString(6, a.getAtualizadoEm());
		ps.execute();
		ps.close();
		c.close();
		
		return a;
	}
	
	public String insUpdDel(Assunto a, String cod) throws SQLException {
		String sql = "{CALL sp_iud_assunto (?,?,?,?,?,?,?,?)}";
		CallableStatement cs = c.prepareCall(sql);
		cs.setString(1, cod);
		cs.setString(2, a.getCriadoEm());
		cs.setInt(3, a.getQtdFavoritos());
		cs.setInt(4, a.getQtdCompartilhamento());
		cs.setString(5, a.getFonte());
		cs.setString(6, a.getDescricao());
		cs.setString(7, a.getAtualizadoEm());
		cs.registerOutParameter(8, Types.VARCHAR);
		
		cs.execute();
		String saida = cs.getString(8);
		cs.close();
		c.close();
		return saida;
	}
	
	@Override
	public List<Assunto> listaAssuntos() throws SQLException, ClassNotFoundException {
		Connection c = gDao.getConnection();
		List<Assunto> lista = new ArrayList<Assunto>();
		String sql = "SELECT a.id_as, a.criadoem, a.qtdfavoritos, a.qtdcompartilhamento, a.fonte, a.descricao, a.atualizadoem FROM assunto a";
		PreparedStatement ps = c.prepareStatement(sql);
		ResultSet rs = ps.executeQuery();
		while (rs.next()) {
			Assunto a = new Assunto();
			a.setId(rs.getInt("id_as"));
			a.setCriadoEm(rs.getString("criadoem"));
			a.setQtdFavoritos(rs.getInt("qtdfavoritos"));
			a.setQtdCompartilhamento(rs.getInt("qtdcompartilhamento"));
			a.setFonte(rs.getString("fonte"));
			a.setDescricao(rs.getString("descricao"));
			a.setAtualizadoEm(rs.getString("atualizadoem"));
			
			lista.add(a);
		}
		
		rs.close();
		ps.close();
		c.close();
		
		return lista;
	}
}