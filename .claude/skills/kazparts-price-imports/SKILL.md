# Auto Parts Price Imports

Use this skill when implementing price-list upload, parsing, validation, mapping, import jobs, or import history.

## Triggers

- Work touches CSV, TXT, XLS, XLSX, archives, email import, or supplier price files.
- Work touches `apps/worker` import jobs.
- Work touches stock/price bulk updates from files.
- Work references the legacy Python importer.

## Required Context

Read first:

- `docs/implementation/phases.md`
- `docs/legacy-analysis/project-summary.md`

Reference legacy files:

- `../testparts/pyprices/api.py`
- `../testparts/pyprices/price_file_handler.py`
- `../testparts/pyprices/item_to_handle.py`
- `../testparts/pyprices/price_record.py`
- `../testparts/pyprices/requirements.txt`

## Design Rules

- Imports must run in workers, not inside HTTP request handlers.
- Upload should create an import job record and enqueue processing.
- Store original files before parsing.
- Track mapping, row counts, errors, and final status.
- Parse in streaming/batched mode where possible.
- Apply database writes in bounded batches.
- Make jobs retry-safe and avoid double-applying the same file.
- Keep raw row errors available for manager review.

## Supported Formats

Plan for:

- CSV
- TXT
- XLS
- XLSX
- Later: archives and email attachments if needed

## Verification

Use fixtures for:

- UTF-8 CSV
- CP1251-like data if supported by the parser
- Semicolon, comma, and tab delimiters
- XLSX with real-world messy rows
- Invalid/missing required columns

