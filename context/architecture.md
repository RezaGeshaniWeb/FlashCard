# Architecture

## Architecture Style

Feature-Based Architecture

Each feature owns its:

- components
- hooks
- services
- types
- pages
- utils

---

## Folder Structure

src/

app/

assets/

components/

features/

hooks/

layouts/

pages/

routes/

services/

store/

types/

utils/

constants/

---

## Feature Structure

features/

deck/

components/

hooks/

pages/

services/

types/

utils/

---

## Layers

### Presentation

Pages

Layouts

Components

---

### Business

Hooks

Store

Validation

Permissions

---

### Data

API Services

React Query

Axios

---

## Routing

/

login

register

dashboard

decks

decks/:id

study/:deckId

statistics

profile

settings

404

---

## Authentication Flow

Login

↓

Receive JWT

↓

Store token

↓

Fetch profile

↓

Navigate dashboard

---

## State Management

React Query

↓

Server Cache

↓

Zustand

↓

UI State

↓

Local Component State

---

## API Pattern

Page

↓

Hook

↓

Service

↓

Axios Client

↓

Backend

---

## Shared Components

Button

Input

Card

Modal

Dialog

Badge

Avatar

Dropdown

Tabs

Toast

Pagination

Search

Loader

Empty State

Error State

---

## Error Boundaries

Application

↓

Page

↓

Feature

---

## Lazy Loading

Dashboard

Study

Statistics

Settings

Admin (future)

---

## Performance

Memoized Components

Lazy Routes

Image Optimization

Request Caching

Code Splitting

Prefetch Next Pages

---

## Future Architecture

Offline Support

PWA

Background Sync

AI Module

Plugin System

Multi-language

Real-time Collaboration
