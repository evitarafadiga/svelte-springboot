package br.com.fateczl.ProjetoLibero.persistence;

import java.sql.SQLException;
import java.util.List;

import br.com.fateczl.ProjetoLibero.model.Assunto;

public interface IAssuntoDao {

	List<Assunto> listaAssuntos() throws SQLException, ClassNotFoundException;

	Assunto insereAssunto(Assunto a) throws SQLException, ClassNotFoundException;

	String insertAssunto(Assunto a) throws SQLException;

	String updateAssunto(Assunto a) throws SQLException;

	String deleteAssunto(Assunto a) throws SQLException;

	List<Assunto> listaAssuntosDeUsuario(int id) throws SQLException, ClassNotFoundException;

}
