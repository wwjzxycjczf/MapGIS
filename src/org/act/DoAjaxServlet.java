package org.act;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class DoAjaxServlet extends HttpServlet {  
    
   protected void processRequest(HttpServletRequest request, HttpServletResponse response)  
   throws ServletException, IOException {  
       response.setContentType("text/html;charset=UTF-8");  
       PrintWriter out = response.getWriter();  
       try {  
           response.setContentType("text/html");  
           response.setHeader("Cache-Control", "no-store");  
           response.setHeader("Pragma", "no-cache");  
           response.setDateHeader("Expires", 0);  
           String information = request.getParameter("id");  
           org.act.MapGISService1Stub rstub1 = new org.act.MapGISService1Stub();
           boolean flag1 = rstub1.readFile().get_return();
          System.out.println(flag1);
//          if(information!=""){
        		String ctl = information.substring(0,information.indexOf(";"));
        		MapGISService1Stub.GetState conf = new MapGISService1Stub.GetState();
        		conf.setFlag(0);
        		conf.setId(Integer.parseInt(information.substring(information.indexOf(";")+1)));
//        		conf.setCtl(ctl);
//        		conf.setId(Integer.parseInt(information.substring(information.indexOf(";")+1)));
//        		conf.setFlag(0);
        		int flag=rstub1.GetState(conf).get_return();
        		System.out.println(flag);
//          }
           if(information.equals("1")) {  
               out.write("OK");  
           }  
           else {  
               out.write("NO");  
           }  
       } finally {   
           out.close();  
       }  
   }   
 
   @Override  
   protected void doGet(HttpServletRequest request, HttpServletResponse response)  
   throws ServletException, IOException {  
       processRequest(request, response);  
   }   
 
   @Override  
   protected void doPost(HttpServletRequest request, HttpServletResponse response)  
   throws ServletException, IOException {  
       processRequest(request, response);  
   }  
 
   @Override  
   public String getServletInfo() {  
       return "Short description";  
   }  
 
}  