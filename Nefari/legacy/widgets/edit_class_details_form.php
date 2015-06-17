<label for="course-title">Class Title</label>
<input type="text" name="course-title" id="edit-course-title" placeholder="Ex: Web Authoring I">

<label for="subject-code">Subject Code</label>
<input type="text" name="subject-code" id="edit-subject-code" maxlength="4" placeholder="Ex: ANIM, DIGM, WBDV">

<label for="course-number">Course Number</label>
<input type="text" name="course-number" id="edit-course-number" maxlength="4" placeholder="Ex: X101">

<label for="section">Section</label>
<input type="text" name="section" id="edit-section" maxlength="3" placeholder="Ex: 001">

<label for="crn">CRN</label>
<input type="text" name="crn" id="edit-crn" maxlength="5" placeholder="Ex: 12345">

<label for="start-date">Start Date</label>
<input type="date" name="start-date" id="edit-start-date">

<label for="end-date">End Date</label>
<input type="date" name="end-date" id="edit-end-date">

<label for="start-time">Start Time</label>
<input type="time" name="start-time" id="edit-start-time">

<label for="end-time">End Time</label>
<input type="time" name="end-time" id="edit-end-time">

<label>Meeting Days</label><br>

<div class="meeting-days">
	<label for="edit-monday" class="m-day-label" id="monday-label">Monday</label>
	<input type="checkbox" name="meeting-days[]" id="edit-monday" value="Monday">
	
	<label for="edit-tuesday" class="m-day-label">Tuesday</label>
	<input type="checkbox" name="meeting-days[]" id="edit-tuesday" value="Tuesday">
	
	<label for="edit-wednesday" class="m-day-label">Wednesday</label>
	<input type="checkbox" name="meeting-days[]" id="edit-wednesday" value="Wednesday">
	
	<label for="edit-thursday" class="m-day-label">Thursday</label>
	<input type="checkbox" name="meeting-days[]" id="edit-thursday" value="Thursday">
	
	<label for="edit-friday" class="m-day-label">Friday</label>
	<input type="checkbox" name="meeting-days[]" id="edit-friday" value="Friday">
</div>