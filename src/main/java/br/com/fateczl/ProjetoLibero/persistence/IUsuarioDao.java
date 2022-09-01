package br.com.fateczl.ProjetoLibero.persistence;

import java.sql.SQLException;

import br.com.fateczl.ProjetoLibero.model.Usuario;

public interface IUsuarioDao {

	String insertUsuario(Usuario u) throws SQLException;

	String updateUsuario(Usuario u) throws SQLException;

	String deleteUsuario(Usuario u) throws SQLException;

}
