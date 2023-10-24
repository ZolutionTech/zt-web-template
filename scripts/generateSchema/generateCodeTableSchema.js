const fs = require('fs')
const path = require('path')

const dynamicFolder = process.argv[2]

// Specify the source file and target directory
const sourceFilePath = './scripts/generateSchema/CodeTable.graphql'

const targetDirectory = `./amplify/backend/api/${dynamicFolder}/schema/`
const fileToBeDeleted = `./amplify/backend/api/${dynamicFolder}/schema.graphql`

// Ensure the target directory exists, create it if it doesn't
if (!fs.existsSync(targetDirectory)) {
  fs.mkdirSync(targetDirectory, { recursive: true })
}

// Check if the source file exists
if (fs.existsSync(sourceFilePath)) {
  try {
    // Read the contents of the source file
    const sourceFileContent = fs.readFileSync(sourceFilePath, 'utf8')

    // Write the contents to the target schema file
    fs.writeFileSync(targetDirectory + 'CodeTable.graphql', sourceFileContent)

    // Delete the existing schema.graphql file
    fs.unlinkSync(fileToBeDeleted)

    console.log('File copied and existing schema.graphql deleted successfully.')
  } catch (error) {
    console.error('Error:', error)
  }
} else {
  console.error('Source file does not exist.')
}
