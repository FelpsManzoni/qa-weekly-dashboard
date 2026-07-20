After having implemented all the initial features on the system, and evaluating the current system, I've noticed some issues and UX improvements alongside with some features that were incorrectly implemented or misgided to a process that do not make sense.
Bellow I'll try to explain the processess, identified issues and what I expect at the end of the implementation as well.

## 0 - Fundamental requirements

RQ0.1 - The main dashboard page only displays: 1- the page header (with page title as is, loged user, refresh data button and logout button), 2- the week carousel selector, 3- the stacked project selector, 4- the dashboard itself with the project informations;
RQ0.2 - All other options for registering projects, project informations and other management systems for dashboard data, are displayed as separete tabs in the left menu that can be shown or hiden clicking in the left side menu button;

## 1 - Week display and selection

RQ1.1 - The week selector at the top of the dashboard page shows all the available weeks for selection in sequence;
RQ1.2 - The first displayed week at the left of the carrousel is always the latest recorded week for the project;
RQ1.3 - Only weeks that contain data are displayed in the carrousel, weeks that doesn't contain any data are not displayed;
RQ1.4 - When a week is selected in the top carousell section, the data in the dashboard is updated to display the week related data;
RQ1.5 - Weeks are only stored for 1 year, data older than 1 year is not displayed anymore in the dashboard;
RQ1.6 - Weeks are counted from Monday to Sunday, sequentially, for example: Week 28 is from Monday, July 6, 2026 until (and including) Sunday, July 12, 2026;

## 2 - Projects management

RQ2.1 - When accessing the projects menu option, all registered projects are listed in the screen;
RQ2.2 - To add a project I can click on Add new button that will prompt a pop out overlay screen to input the new project fields and click save or cancel;
RQ2.3 - When I click on a listed project in the project list, a pop-out overlay screen is shown with the project information where I can change all the project information fields and save or cancel the edit;
RQ2.4 - For each project we have the following fields: (current fields to maintain): Code, Name, Description, (New fields): Lead QA (associated with a system user id), Client, Main Technology Scope (text short field);

## 3 - Project data

RQ3.1 - For the sections 'issue metrics', 'test coverage', 'notes', and 'releases', we can edit and manage this informations in a single menu option page named "Project Data";
RQ3.2 - When I access the Project Data page, I can select the project I want to change the informations from in a dropdown menu in the top left, and right beside it, I can select for which week I want to manipulate the information for;
RQ3.3 - When I select the project and week, the information for each section inside the page is loaded according to the selection and I can edit the informations as needed;
RQ3.4 - Informations are saved when I click save at the end of the page;

## 4 - UI improvements and fixes

1. The dark/light mode should have its status icons inverted, displaying the current state of the screen;
2. The language selection should display the currently applied language on the page and it should be displayed as the brazilian flag when in portuguese, and the USA flag when in english;
3. Review all the buttons and texts when the page is in dark mode: background collor should be darker, and text should be lighter to contrast;
4. On the notes section in the dashboard only the main title should display the text NOTES, then, for each note priority a colored block (red for P0) with the sequential list of notes inside it;
5. Releases should have only four status: Approved (Green), Failed (red), Conditionaly Approved (orange), Blocked (blue);
6. Release table should display: release date (dd/mm/yyyy), version number, status, number of issues found (categorized - A,B,C), release notes (button to open a text box);
7. Release notes of each release is a long text field in the release section that users can describe the release notes;
8. When I click the release notes of a release, a text box overlay should be displayed for me with the release notes info;