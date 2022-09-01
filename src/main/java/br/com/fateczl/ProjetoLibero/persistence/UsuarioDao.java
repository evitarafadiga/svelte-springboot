package br.com.fateczl.ProjetoLibero.persistence;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.fateczl.ProjetoLibero.model.Assunto;
import br.com.fateczl.ProjetoLibero.model.Usuario;

@Component
public class UsuarioDao implements IUsuarioDao{
	
	@Autowired
	GenericDao gDao;
	
	private Connection c;
	
	@Override
	public String insertUsuario(Usuario u) throws SQLException {
		String saida = insUpdDel(u, "I");
		return saida;
	}
	
	@Override
	public String updateUsuario(Usuario u) throws SQLException {
		String saida = insUpdDel(u, "U");
		return saida;
	}
	
	@Override
	public String deleteUsuario(Usuario u) throws SQLException {
		String saida = insUpdDel(u, "D");
		return saida;
	}
	
	public String insUpdDel(Usuario u, String cod) throws SQLException {
		String sql = "{CALL sp_iud_usuario (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";
		CallableStatement cs = c.prepareCall(sql);
		cs.setString(1, cod);
		cs.setInt(2, u.getId());
		cs.setString(3, u.getCriadoEm());
		cs.setString(4, u.getEmail());
		cs.setString(5, u.getSenha());
		cs.setBoolean(6, u.isImagemPadrao());
		cs.setString(7, u.getDescricao());
		cs.setInt(8, u.getQtdFavoritos());
		cs.setString(9, u.getLingua());
		cs.setString(10, u.getLocacao());
		cs.setString(11, u.getNome());
		cs.setBoolean(12, u.isNotificacoes());
		cs.setString(13, u.getImagemDoPerfilUrl());
		cs.setBoolean(14, u.isContribuidor());
		cs.setBoolean(15, u.isStaff());
		cs.setBoolean(16, u.isProfessor());
		cs.registerOutParameter(17, Types.VARCHAR);
		
		cs.execute();
		String saida = cs.getString(17);
		cs.close();
		c.close();
		return saida;
	}
	
	public Usuario getUsuario(int id) throws SQLException, ClassNotFoundException {
		Connection c = gDao.getConnection();
		Usuario u = new Usuario();
		String sql = "SELECT u.id_usr, u.email, u.imagempadrao, u.descricao, u.qtdfavoritos,"
				+ " u.lingua, u.locacao, u.nome, u.notificacoes, u.imagemdoperfilurl,"
				+ " u.contribuidor, u.staff, u.professor FROM usuario u WHERE u.id_usr = ?";
		PreparedStatement ps = c.prepareStatement(sql);
		ResultSet rs = ps.executeQuery();
		
		u.setId(rs.getInt("id_usr"));
		u.setEmail(rs.getString("email"));
		u.setImagemPadrao(rs.getBoolean("imagempadrao"));
		u.setDescricao(rs.getString("descricao"));
		u.setQtdFavoritos(rs.getInt("qtdfavoritos"));
		u.setLingua(rs.getString("lingua"));
		u.setLocacao(rs.getString("locacao"));
		u.setNome(rs.getString("nome"));
		u.setNotificacoes(rs.getBoolean("notificacoes"));
		u.setImagemDoPerfilUrl(rs.getString("imagemdoperfilurl"));
		u.setContribuidor(rs.getBoolean("contribuidor"));
		u.setStaff(rs.getBoolean("staff"));
		u.setProfessor(rs.getBoolean("professor"));
		
		rs.close();
		ps.close();
		c.close();
		return u;
	}

}
