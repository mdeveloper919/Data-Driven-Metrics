# Release Notes

## v3.1.1

- Added reference to Millstone v2.3.1 in package.json.
- Additional minor formatting cleanup in /src/components/home/AppHome.js.

## v3.1.0

- Added reference to Grommet v1.0.0 and Millstone v2.3.0 in package.json.
- Fixed incorrect Git repository URL in package.json.
- Minor formatting cleanup in /src/components/home/AppHome.js.

## v3.0.0

- Complete overhaul of project which incorporates the great work of Cory House from his React Slingshot project. Review project docs for more details about the changes.

## v2.1.0

### 2016-08-19

- Removed from `isInternal` as a means for choosing branding. Moved to the use of separate components for implementing different layouts. This will allow us to implement multiple versions of AppWrap based new UI patterns from the Grommet team and/or Marketing.

### 2016-08-09

- Changed template to illustrate fill header width Search input. Change suggested by Grommet team.

### 2016-08-08

- Fixed a bug with the split component and how it worked on date objects.

### 2016-07-28

- Switched to `browserHistory` rather than hashHistory. This makes routes prettier when navigating via react-router. Change suggested by Grommet team.

### 2016-07-27

- Integrated with Millstone package to allow non-destructive updates.

### 2016-07-22

- Initial release with `PageMill` name.
