# Exercise Tracker

This service will add new users to database and add their exercise logs.

A Full-stack JavaScript application built using Node, Express, MongoDB, Mongoose, JavaScript, HTML, CSS and Bootstrap

## User Stories

- I can POST a URL to [project_url]/api/exercise/new-user and I will receive a response in JSON format.
- If I pass an invalid username or already existing one, the JSON response will contain an error
- If I don't fill out all the required fields, the JSON response will contain an error
- When I GET [project_url]/api/exercise/log?{username}[&from][&to][&limit], I will receive a response in JSON format.

## Example Usage
```
https://my-exercise-tracker.herokuapp.com/api/exercise/log?username=stormi186
```

## Example Output

```javascript
[{"_id":"5d6a64d7fd910b0017170c33","userId":"5d6a64a6fd910b0017170c32","description":"fss","duration":44,"date":"1985-11-10T00:00:00.000Z"},
{"_id":"5d6a65f7fd910b0017170c34","userId":"5d6a64a6fd910b0017170c32","description":"sfsf","duration":43,"date":"1968-11-22T00:00:00.000Z"}]
```

## Live Preview

[https://my-exercise-tracker.herokuapp.com](https://my-exercise-tracker.herokuapp.com)
