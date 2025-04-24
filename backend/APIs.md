## Index:
- [Description](#description)
- [API Table](#api-table)
- [APIs Description](#apis-description)
    - [User](#user)
        - [Register](#register)
        - [Login](#login)
        - [Refresh](#refresh)
        - [Search For Users](#search-for-users)
        - [User Inofermation](#user-inofermation)
        - [Set User as Active](#set-user-as-active)
        - [Update Information](#update-user-information)
        - [Update Password](#update-user-password)
        - [Delete](#delete-user)
        - [Admin Delete User](#admin-delete-user)
        - [Logout](#logout)
    - [Job](#job)
        - [Get Jobs](#get-jobs)
        - [Get Your Jobs](#get-your-jobs)
        - [Create Job](#create-job)
        - [Get Job information](#get-job-information)
        - [Update Job](#update-job)
        - [Delete Job](#delete-job)


## Description:
This file contains a detailed description of the API design.

## API Table:
| API                                                  | HTTP   | For                                             |
|------------------------------------------------------|--------|-------------------------------------------------|
| [/api/v1/user/register](#register)                   | POST   | Create new user.                                |
| [/api/v1/user/login](#login)                         | POST   | Login and verify the user.                      |
| [/api/v1/user/refresh](#refresh)                     | GET    | Verify if user loged in and create new tokens.  |
| [/api/v1/user?name=&s=&e=](#search-for-users)        | GET    | Get the users for the admin.                    |
| [/api/v1/user/info/{id}](#user-inofermation)         | GET    | Get account information.                        |
| [/api/v1/user/active/{id}](#set-user-as-active)      | PATCH  | Set the user as Active by the admin.            |
| [/api/v1/user/update/info](#update-user-information) | PATCH  | Update the current user information.            |
| [/api/v1/user/update/pass](#update-user-password)    | PATCH  | Update the current user password.               |
| [/api/v1/user/delete](#delete-user)                  | DELETE | Delete the current user.                        |
| [/api/v1/user/delete/{id}](#admin-delete-user)       | DELETE | Delete user by the admin.                       |
| [/api/v1/user/logout](#logout)                       | POST   | Logout the currrent user and delete the tokens. |
| [/api/v1/job?s=&e=](#get-jobs)                       | GET    | Get jobs by filters.                            |
| [/api/v1/job/your?s=&e=](#get-your-jobs)             | GET    | Get user jobs.                                  |
| [/api/v1/job/create](#create-job)                    | POST   | Create new job.                                 |
| [/api/v1/job/info/{id}](#get-job-information)        | GET    | Get job information.                            |
| [/api/v1/job/update/{id}](#update-job)               | PATCH  | Update job information.                         |
| [/api/v1/job/delete/{id}](#delete-job)               | DELETE | Delete the job.                                 |

## APIs Description:

### User:
#### Register:
- API: `POST /api/v1/user/register`
- Description: use to create new user.
- Request body:
    - type: `multipart/form-data`
    - Example:
    ```json
    {
        "name": "Tech Vision",
        "description": "Company description.",
        "email": "techvision@techvision.org",
        "company_type": "Company type",
        "phone": "+967 700000000",
        "address": "Compnat Location",
        "website": "https://techvision.org",
        "social_url_1": "Link 1",
        "social_url_2": "Link 2",
        "social_url_3": "Link 3",
        "social_url_4": "Link 4",
        "password": "Mohaned2023+",
        "confirmation": "Mohaned2023+"
        "profileImage": (binary file data of the image)
    }
    ```
    - Body rules:
        - name:
            - Required.
            - Type: string.
            - Length: Between 2 and 255 characters.
        - description:
            - Required.
            - Type: string.
            - Length: Between 10 and 1000 characters.
        - email:
            - Required.
            - Type: string.
            - Length: Between 5 and 255 characters.
            - It must be a valid email address.
        - company_type:
            - Required.
            - Type: string.
            - Length: Between 3 and 100 characters.
        - phone:
            - Required.
            - Type: string.
            - It must be a valid phone number.
        - address:
            - Required.
            - Type: string.
            - Length: Between 3 and 255 characters.
        - website:
            - Optional.
            - Type: string.
            - It must be a valid URL.
        - social URLs:
            - Optional.
            - Type: array of 4 strings.
            - Each link should be a valid URL.
        - password:
            - Required.
            - Type: string.
            - Length: Between 8 and 512 characters.
            - Pattern: Must consist of:
                - Lowercase letters a-z.
                - Uppercase letters A-Z.
                - Digits 0-9.
                - Special characters (\w).
            - Pattern: The password must match this regex pattern:
                - `/((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/`
        - confirmation:
            - Required.
            - Must match the password.
        - profileImage:
            - Optional.
            - Type: file (binary data of the image, can be handled via multipart/form-data).
- Response:
    - Type: `JSON`
    - Example:
    ```json
    {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48",
        "user":    {
            "id": 203,
            "name": "Tech Vision",
            "description": "Company description.",
            "email": "techvision@techvision.org",
            "company_type": "Company type",
            "phone": "+967 700000000",
            "address": "Compnat Location",
            "website": "https://techvision.org",
            "social_url_1": "Link 1",
            "social_url_2": "Link 2",
            "social_url_3": "Link 3",
            "social_url_4": "Link 4",
            "role": "user", // role onle "user" or "admin"
            "profile_image_url": "/uploads/1743937572726.png"
        }
    }
    ```
    - Status codes:
        | Status | Name                | Description                                                    |
        |--------|---------------------|----------------------------------------------------------------|
        | 201    | Created             | User created.                                                  |
        | 302    | Found               | Email is found in the database!                                |
        | 400    | BadRequest          | Request body is missing some fields or confirmation not match. |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.                    |
        | 500    | InternalServerError | Backend failure -> submit an issue in github.                  |
---
#### Login:
- API: `POST /api/v1/user/login`
- Description: login.
- Request body:
    - type: `JSON`
    - Example:
    ```json
    {
        "email": "techvision@techvision.org",
        "password": "Mohaned2023+"
    }
    ```
    - Body rules:
        - email:
            - Required.
            - Type: string.
            - Length: Between 5 and 255 characters.
            - It must be a valid email address.
        - password:
            - Required.
            - Type: string.
            - Length: Between 8 and 512 characters.
            - Pattern: Must consist of:
                - Lowercase letters a-z.
                - Uppercase letters A-Z.
                - Digits 0-9.
                - Special characters (\w).
            - Pattern: The password must match this regex pattern:
                - `/((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/`
- Response:
    - Type: `JSON`
    - Example:
    ```json
    {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48",
        "user":    {
            "id": 203,
            "name": "Tech Vision",
            "description": "Company description.",
            "email": "techvision@techvision.org",
            "company_type": "Company type",
            "phone": "+967 700000000",
            "address": "Compnat Location",
            "website": "https://techvision.org",
            "social_url_1": "Link 1",
            "social_url_2": "Link 2",
            "social_url_3": "Link 3",
            "social_url_4": "Link 4",
            "role": "user", // role onle "user" or "admin"
            "profile_image_url": "/uploads/1743937572726.png"
        }
    }
    ```
    - Status codes:
        | Status | Name                       | Description                                   |
        |--------|----------------------------|-----------------------------------------------|
        | 200    | OK                         | User loged in.                                |
        | 400    | BadRequest                 | Request body is missing some fields.          |
        | 401    | Unauthorized               | Invalid password.                             |
        | 404    | NotFound                   | User not found, not registered.               |
        | 429    | TooManyRequests            | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 451    | UnavailableForLegalReasons | User data under review.                       |
        | 500    | InternalServerError        | Backend failure -> submit an issue in github. |
---
#### Refresh:
- API: `GET /api/v1/user/refresh`
- Description: Verify if user loged in and create new tokens.
- Request body:
    - Not required
- Response:
    - Type: `JSON`
    - Example:
    ```json
    {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48",
        "user":    {
            "id": 203,
            "name": "Tech Vision",
            "description": "Company description.",
            "email": "techvision@techvision.org",
            "company_type": "Company type",
            "phone": "+967 700000000",
            "address": "Compnat Location",
            "website": "https://techvision.org",
            "social_url_1": "Link 1",
            "social_url_2": "Link 2",
            "social_url_3": "Link 3",
            "social_url_4": "Link 4",
            "role": "user", // role onle "user" or "admin"
            "profile_image_url": "/uploads/1743937572726.png"
        }
    }
    ```
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | OK                  | User loged in.                                |
        | 401    | Unauthorized        | Refresh token is expired.                     |
        | 404    | NotFound            | User not found, not registered.               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Search For Users:
- API: `GET /api/v1/user?name=&s=&e=`
    - name is optional.
    - s and e are numbers -> s and e not lass than 0 and e not lass than s.
    - `NOTE` max number of users return is 50 user.
- Description: Get the users for the admin.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - Not required
- Response:
    - Type: `JSON`
    - Example:
    ```json
    [
        {
            "id": 203,
            "name": "Tech Vision",
            "email": "techvision@techvision.org",
            "company_type": "Company type",
            "phone": "+967 700000000",
            "address": "Compnat Location",
            "website": "https://techvision.org",
            "profile_image_url": "/uploads/1743937572726.png",
            "created_at": "2025-04-15",
            "updated_at": "2025-04-15",
            "days_since_creation": 14
        }
    ]
    ```
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | OK                  | User loged in.                                |
        | 400    | BadRequest          | Invalide start or end.                        |
        | 401    | Unauthorized        | Invalide accessToken.                         |
        | 403    | Forbidden           | User is not admin.                            |
        | 404    | NotFound            | Users not found.                              |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### User Inofermation:
- API: `GET /api/v1/user/info/{id}`
    - id must be integer.
- Description: Get account information.
- Request body:
    - Not required
- Response:
    - Type: `JSON`
    - Example:
    ```json
    {
        "id": 203,
        "name": "Tech Vision",
        "description": "Company description.",
        "email": "techvision@techvision.org",
        "company_type": "Company type",
        "phone": "+967 700000000",
        "address": "Compnat Location",
        "website": "https://techvision.org",
        "social_url_1": "Link 1",
        "social_url_2": "Link 2",
        "social_url_3": "Link 3",
        "social_url_4": "Link 4",
        "profile_image_url": "/uploads/1743937572726.png"
    }
    ```
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | OK                  | User loged in.                                |
        | 404    | NotFound            | User not found, not registered.               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Set User as Active:
- API: `PATCH /api/v1/user/active/{id}`
    - id is number start from 1.
- Description: Set the user as Active by the admin.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - Not required
- Response:
    - Body Null
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | OK                  | User updated.                                 |
        | 401    | Unauthorized        | Access token is expired.                      |
        | 403    | Forbidden           | User is not admin.                            |
        | 404    | NotFound            | User not found.                               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Update User Information:
- API: `PATCH /api/v1/user/update/info`
- Description: Update the current user information.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - you can update one or more of:
		- name.
		- description.
		- email.
		- company_type.
		- phone.
		- address.
		- website.
		- social:
            - social_url_1
            - social_url_2
            - social_url_3
            - social_url_4
        - profileImage.
    - type: `JSON`
    - Example:
    ```json
    {
        "name": "Tech Vision",
        "description": "Company description.",
        "email": "techvision@techvision.org",
        "company_type": "Company type",
        "phone": "+967 01-000-000",
        "address": "Compnat Location",
        "website": "https://techvision.org",
        "social_url_1": "Link 1",
        "social_url_2": "Link 2",
        "social_url_3": "Link 3",
        "social_url_4": "Link 4",
        "profileImage": (binary file data of the image)
    }
    ```
    - Body rules:
        - name:
            - Required.
            - Type: string.
            - Length: Between 2 and 255 characters.
        - description:
            - Required.
            - Type: string.
            - Length: Between 10 and 1000 characters.
        - email:
            - Required.
            - Type: string.
            - Length: Between 5 and 255 characters.
            - It must be a valid email address.
        - company_type:
            - Required.
            - Type: string.
            - Length: Between 3 and 100 characters.
        - phone:
            - Required.
            - Type: string.
            - It must be a valid phone number.
        - address:
            - Required.
            - Type: string.
            - Length: Between 3 and 255 characters.
        - website:
            - Optional.
            - Type: string.
            - It must be a valid URL.
        - social URLs:
            - Optional.
            - Type: array of 4 strings.
            - Each link should be a valid URL.
- Response:
    - Type: `JSON`
    - Example:
    ```json
    {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48",
        "user":    {
            "id": 203,
            "name": "Tech Vision",
            "description": "Company description.",
            "email": "techvision@techvision.org",
            "company_type": "Company type",
            "phone": "+967 700000000",
            "address": "Compnat Location",
            "website": "https://techvision.org",
            "social_url_1": "Link 1",
            "social_url_2": "Link 2",
            "social_url_3": "Link 3",
            "social_url_4": "Link 4",
            "role": "user", // role onle "user" or "admin"
            "profile_image_url": "/uploads/1743937572726.png"
        }
    }
    ```
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | ok                  | User information updated.                     |
        | 302    | Found               | Email is found in the database!               |
        | 400    | BadRequest          | Invalid body.                                 |
        | 401    | Unauthorized        | Invalid access token.                         |
        | 403    | Forbidden           | User tried to update another account.         |
        | 404    | NotFound            | User not found, not registered.               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Update User Password:
- API: `PATCH /api/v1/user/update/pass`
- Description: Update the current user password.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "oldPassword": "Mohaned2023+",
        "password": "Mohaned.1.3+1",
        "confirmation": "Mohaned.1.3+1"
    }
    ```
    - Body rules:
        - password and oldPassword:
            - Required.
            - Type: string.
            - Length: Between 8 and 512 characters.
            - Pattern: Must consist of:
                - Lowercase letters a-z.
                - Uppercase letters A-Z.
                - Digits 0-9.
                - Special characters (\w).
            - Pattern: The password must match this regex pattern:
                - `/((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/`
        - confirmation:
            - Required.
            - Must match the password.
- Response:
    - body Null
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | ok                  | User password updated.                        |
        | 400    | BadRequest          | Invalid body or confirmation not match.       |
        | 401    | Unauthorized        | Invalid access token or invalid password.     |
        | 404    | NotFound            | User not found, not registered.               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Delete User:
- API: `DELETE /api/v1/user/delete`
- Description: Delete the current user.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - required
    - type: `JSON`
    - Example:
    ```json
    {
        "password": "Mohaned2023+"
    }
    ```
    - Body rules:
        - password:
            - Required.
            - Type: string.
            - Length: Between 8 and 512 characters.
            - Pattern: Must consist of:
                - Lowercase letters a-z.
                - Uppercase letters A-Z.
                - Digits 0-9.
                - Special characters (\w).
            - Pattern: The password must match this regex pattern:
                - `/((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/`
- Response:
    - Body Null
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | OK                  | User deleted.                                 |
        | 401    | Unauthorized        | Access token is expired or invalid password.  |
        | 404    | NotFound            | User not found, not registered.               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Admin Delete User:
- API: `DELETE /api/v1/user/delete/{id}`
    - id is number start from 1.
- Description: Delete user by the admin.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - Not required
- Response:
    - Body Null
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | OK                  | User deleted.                                 |
        | 401    | Unauthorized        | Access token is expired.                      |
        | 403    | Forbidden           | User is not admin.                            |
        | 404    | NotFound            | User not found.                               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Logout:
- API: `POST /api/v1/user/logout`
- Description: Logout the currrent user and delete the tokens.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - Not required
- Response:
    - body Null
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | OK                  | User loged out.                               |
        | 401    | Unauthorized        | Access token is expired or invalid password.  |
        | 404    | NotFound            | User not found, not registered.               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---

### Job:
#### Get Jobs:
- API: `GET /api/v1/job?s=&e=`
    - s and e are numbers -> s and e not lass than 0 and e not lass than s.
    - `NOTE` max number of jobs return is 50 job.
- Description: Get jobs by filters.
- Request body:
    - Job filters:
        - title.
        - type.
        - department.
        - end_date.
        - created_at.
        - city.
        - company_name.
    - Example:
    ```json
    {
        "title": "Backend Developer",
        "type": "developer",
        "department": "CS",
        "end_date": "2025-04-19",
        "created_at": "2025-04-06",
        "city": "sana'a",
        "company_name": "Tech Vision"
    }
    ```
    - Body rules:
        - title:
            - Optional.
            - Type: string.
            - Length: Between 2 and 255 characters.
        - type:
            - Optional.
            - Type: string.
            - Length: Between 3 and 100 characters.
        - department:
            - Optional.
            - Type: string.
            - Length: Between 3 and 100 characters.
        - end_date and start_date:
            - Optional.
            - Type: Data NOT data and time.
        - city:
            - Optional.
            - Type: string.
            - Length: Between 2 and 100 characters.
        - company_name:
            - Optional.
            - Type: string.
            - Length: Between 2 and 255 characters.
        
- Response:
    - Type: `JSON`
    - Example:
    ```json
    [
        {
            "id": 75,
            "title": "Backend Developer",
            "type": "developer",
            "department": "CS",
            "end_date": "2025-04-19",
            "created_at": "2025-04-06",
            "city": "sana'a",
            "company_name": "Tech Vision",
            "remaining_days": 23,
            "status": "open", //  status are "open" and "close",
            "company_image": "/uploads/1743937572726.png"
        }
    ]
    ```
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | ok                  | ok.                                           |
        | 400    | BadRequest          | Number of job requested is out of range.      |
        | 404    | NotFound            | There is no jobs.                             |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Get Your Jobs:
- API: `GET /api/v1/job/your?s=&e=`
    - s and e are numbers -> s and e not lass than 0 and e not lass than s.
    - `NOTE` max number of jobs return is 50 job.
- Description: Get user jobs.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - Not required
- Response:
    - Type: `JSON`
    - Example:
    ```json
    [
        {
            "id": 2120,
            "title": "Backend Developer",
            "type": "developer",
            "department": "CS",
            "end_date": "2025-04-19",
            "created_at": "2025-04-06",
            "city": "sana'a",
            "company_name": "Tech Vision",
            "remaining_days": 13
        }
    ]
    ```
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | ok                  | ok.                                           |
        | 400    | BadRequest          | Number of job requested is out of range.      |
        | 401    | Unauthorized        | Access token is expired or invalid password.  |
        | 404    | NotFound            | There is no jobs.                             |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Create Job:
- API: `GET /api/v1/job/create`
- Description: Create new job.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - type: `JSON`
    - Example:
    ```json
    {
        "title": "Backend Developer",
        "body": "The job body..",
        "type": "developer",
        "department": "CS",
        "end_date": "2025-04-19",
        "city": "sana'a",
        "apply_url": "https://techvision.org/apply"
    }
    ```
    - Body rules:
        - title:
            - required.
            - Type: string.
            - Length: Between 2 and 255 characters.
        - body:
            - required.
            - Type: string.
            - Length: Between 100 and 6000 characters.
        - type:
            - required.
            - Type: string.
            - Length: Between 3 and 100 characters.
        - department:
            - required.
            - Type: string.
            - Length: Between 3 and 100 characters.
        - end_date:
            - required.
            - Type: Data.
        - city:
            - required.
            - Type: string.
            - Length: Between 2 and 100 characters.
        - apply_url:
            - required.
            - Type: string.
            - It must be a valid URL.
- Response:
    - Type: `JSON`
    - Example:
    ```json
    {
        "id": 20332
    }
    ```
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 201    | Created             | Job created.                                  |
        | 400    | BadRequest          | Invalid request body.                         |
        | 401    | Unauthorized        | Invalid access token.                         |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Get Job information:
- API: `GET /api/v1/job/info/{id}`
    - id must be integer.
- Description: Get job information.
- Request body:
    - Not required.
- Response:
    - Type: `JSON`
    - Example:
    ```json
    {
        "id": 20332,
        "title": "Backend Developer",
        "body": "The job body..",
        "type": "developer",
        "department": "CS",
        "end_date": "2025-04-19",
        "city": "sana'a",
        "company_image": "/uploads/1743937572726.png",
        "company_name": "Tech Vision",
        "remaining_days": 13,
        "status": "open", //  status are open and close
        "apply_url": "https://techvision.org/apply",
        "created_at": "2025-04-21T14:44:48.839Z",
        "updated_at": "2025-04-21T14:44:48.839Z"
    }
    ```
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | Ok                  | Ok.                                           |
        | 400    | BadRequest          | Invalid ID.                                   |
        | 404    | NotFound            | There is no job.                              |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Update Job:
- API: `PATCH /api/v1/job/update/{id}`
    - id must be integer.
- Description: Update job information.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - required.
    - type: `JSON`
    - you can update one or more of:
        - title.
		- body.
		- type
		- end_date.
		- department.
		- city.
		- apply_url.
    - Example:
    ```json
    {
        "title": "Backend Developer",
        "body": "The job body..",
        "type": "developer",
        "department": "CS",
        "end_date": "2025-04-19",
        "city": "sana'a",
        "apply_url": "https://techvision.org/apply"
    }
    ```
    - Body rules:
        - title:
            - required.
            - Type: string.
            - Length: Between 2 and 255 characters.
        - body:
            - required.
            - Type: string.
            - Length: Between 100 and 6000 characters.
        - type:
            - required.
            - Type: string.
            - Length: Between 3 and 100 characters.
        - department:
            - required.
            - Type: string.
            - Length: Between 3 and 100 characters.
        - end_date:
            - required.
            - Type: Data NOT data and time.
        - city:
            - required.
            - Type: string.
            - Length: Between 2 and 100 characters.
- Response:
    - Type: `JSON`
    - Example:
    ```json
    {
        "id": 20332
    }
    ```
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | ok                  | Job updated.                                  |
        | 400    | BadRequest          | Invalid request body.                         |
        | 401    | Unauthorized        | Invalid access token.                         |
        | 404    | NotFound            | Job not found.                                |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Delete Job:
- API: `DELETE /api/v1/job/delete/{id}`
    - id is number.
- Description: Delete the job.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - Not required.
- Response:
    - body Null
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | ok                  | Job Deleted.                                  |
        | 401    | Unauthorized        | Invalid access token.                         |
        | 404    | NotFound            | Job not found.                                |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---

> By [Mohaned Sherhan (Mr.x)](https://github.com/Mohaned2023)
