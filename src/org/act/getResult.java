package org.act;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;  
import javax.servlet.http.HttpServlet;  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONArray;

public class getResult {

	/**
	 * @param args
	 * @throws IOException 
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException{
		// TODO Auto-generated method stub
		List list = new ArrayList();
		for(int i=0;i<3;i++){
			list.add(i);
		}
		list.add("aString");
		JSONArray jsonArray =JSONArray.fromObject(list);
		System.out.println(jsonArray);
		request.getSession().setAttribute("jsonArray", jsonArray);
		response.sendRedirect("/MapGIS/frameset.jsp");
	}

}
