package pl.tsi8.website.controller;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFSDBFile;

import pl.tsi8.website.config.SpringMongoConfig;

@Controller
public class DefaultController {

	@GetMapping("/")
	public String home() {
		return "/home";
	}

	@GetMapping("/user")
	public String user() {
		return "/user";
	}

	@GetMapping("/login")
	public String login() {
		return "/login";
	}

	@SuppressWarnings("resource")
	@GetMapping("/files")
	public String getSavedFiles(Model model) {
		ApplicationContext ctx = new AnnotationConfigApplicationContext(SpringMongoConfig.class);
		GridFsOperations gridOperations = (GridFsOperations) ctx.getBean("gridFsTemplate");

		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String name = user.getUsername(); // get logged in username
		
		List<GridFSDBFile> result = gridOperations
				.find(new Query().addCriteria(Criteria.where("metadata.user").is(name)));

		model.addAttribute("files", result);

		return "/files";
	}

	@SuppressWarnings("resource")
	@PostMapping("/save")
	public String saveFile(@RequestParam("file") MultipartFile file, RedirectAttributes redirectAttributes) {

		ApplicationContext ctx = new AnnotationConfigApplicationContext(SpringMongoConfig.class);
		GridFsOperations gridOperations = (GridFsOperations) ctx.getBean("gridFsTemplate");
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String name = user.getUsername(); // get logged in username

		DBObject metaData = new BasicDBObject();
		metaData.put("user", name);

		try {
			gridOperations.store(file.getInputStream(), file.getOriginalFilename() + "_" + getCurrentTimeUsingCalendar(), "txt",
					metaData);
		} catch (IOException e) {
			e.printStackTrace();
		}

		return "redirect:/files";
	}

	public static String getCurrentTimeUsingCalendar() {
		Calendar cal = Calendar.getInstance();
		Date date = cal.getTime();
		DateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
		String formattedDate = dateFormat.format(date);
		return formattedDate;
	}

}